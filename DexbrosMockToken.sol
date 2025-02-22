// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.20;

/**
 * ----------------------------------------------------------------------------
 *                           DexbrosToken (No Inflation in Constructor)
 * ----------------------------------------------------------------------------
 * Key Points:
 *  - Name, symbol, decimals, initial supply are configured in constructor.
 *  - inflationBps, inflationInterval are set to zero by default (or can be 
 *    omitted entirely).
 *  - If you want inflation later, the DAO can set them at any time 
 *    (e.g., 1% every 21 days).
 *  - The rest of the contract is the same flexible approach: 
 *      - no forced distribution in constructor,
 *      - optional `setDAOAddress(...)`,
 *      - vesting schedules and `adminWithdraw(...)` for partial unlock, etc.
 * ----------------------------------------------------------------------------
 */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract DexbrosToken is ERC20Permit, AccessControl, ReentrancyGuard {
    using ECDSA for bytes32;

    /*///////////////////////////////////////////////////////////////
                            ===== ROLES =====
    //////////////////////////////////////////////////////////////*/
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE"); // optional, if you ever need it

    /*///////////////////////////////////////////////////////////////
                          TOKEN DETAILS
    //////////////////////////////////////////////////////////////*/
    uint8 private immutable _customDecimals;
    uint256 public initialSupply; // purely for reference

    /*///////////////////////////////////////////////////////////////
                          INFLATION LOGIC
    //////////////////////////////////////////////////////////////*/
    bool public communityPoolDepleted;  
    uint256 public inflationBps;        // 0 by default (no inflation) 
    uint256 public inflationInterval;   // 0 by default 
    uint256 public lastInflationApplied;

    /*///////////////////////////////////////////////////////////////
                            VESTING LOGIC
    //////////////////////////////////////////////////////////////*/
    struct VestingSchedule {
        address beneficiary;  
        uint256 totalAmount;  
        uint256 released;     
        uint64 start;         
        uint64 cliff;         
        uint64 duration;      
        bool revocable;       
        bool revoked;         
    }

    mapping(bytes32 => VestingSchedule) public vestingSchedules;
    uint256 public vestingScheduleCount;

    /*///////////////////////////////////////////////////////////////
                             EVENTS
    //////////////////////////////////////////////////////////////*/
    event DAOAddressSet(address daoAddress);
    event VestingScheduleCreated(bytes32 indexed scheduleId, address indexed beneficiary, uint256 totalAmount);
    event VestingTokensReleased(bytes32 indexed scheduleId, address indexed beneficiary, uint256 amount);
    event VestingRevoked(bytes32 indexed scheduleId, uint256 unvestedBurned);
    event CommunityPoolDepletedSet(bool status);
    event InflationApplied(uint256 newTokensMinted, uint256 newTotalSupply);
    event InflationRateUpdated(uint256 newRateBps);
    event InflationIntervalUpdated(uint256 newInterval);

    /*///////////////////////////////////////////////////////////////
                         CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /**
     * @param _name ERC20 name (e.g., "Dexbros")
     * @param _symbol ERC20 symbol (e.g., "DXZ")
     * @param _decimals e.g., 18 for typical
     * @param _initialSupply minted to the contract on deploy
     *
     * No inflation parameters needed. We set them to zero or can let the DAO call
     * setInflationParameters(...) / updateInflationRate(...) / updateInflationInterval(...)
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    )
        ERC20(_name, _symbol)
        ERC20Permit(_name)
    {
        // Deployer is the default admin
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // record decimals
        _customDecimals = _decimals;

        // store & mint total supply
        initialSupply = _initialSupply;
        _mint(address(this), _initialSupply);

        // Initialize inflation settings to 0
        inflationBps = 0;
        inflationInterval = 0;
        lastInflationApplied = block.timestamp;
    }

    /*///////////////////////////////////////////////////////////////
                     DAO ADDRESS MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    /**
     * @dev Only the default admin can assign the DAO address.
     *      After that, you might renounce your admin role if you want 
     *      only the DAO to control the contract.
     */
    function setDAOAddress(address daoAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(daoAddress != address(0), "Invalid DAO address");
        _grantRole(DAO_ROLE, daoAddress);
        emit DAOAddressSet(daoAddress);
    }

    /*///////////////////////////////////////////////////////////////
                         VESTING FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function createVestingSchedule(
        address _beneficiary,
        uint64 _start,
        uint64 _cliff,
        uint64 _duration,
        uint256 _amount,
        bool _revocable
    ) external onlyRole(DAO_ROLE) {
        require(_beneficiary != address(0), "Beneficiary cannot be zero");
        require(_duration > 0, "Duration must be > 0");
        require(_amount > 0, "Amount must be > 0");
        require(balanceOf(address(this)) >= _amount, "Insufficient contract balance");

        bytes32 scheduleId = keccak256(
            abi.encodePacked(
                _beneficiary,
                block.timestamp,
                _amount,
                vestingScheduleCount
            )
        );

        vestingSchedules[scheduleId] = VestingSchedule({
            beneficiary: _beneficiary,
            totalAmount: _amount,
            released: 0,
            start: _start,
            cliff: _cliff,
            duration: _duration,
            revocable: _revocable,
            revoked: false
        });

        vestingScheduleCount++;
        emit VestingScheduleCreated(scheduleId, _beneficiary, _amount);
    }

    function releaseVestedTokens(bytes32 _scheduleId) external nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[_scheduleId];
        require(schedule.beneficiary != address(0), "Invalid schedule");
        require(!schedule.revoked, "Schedule revoked");

        uint256 vested = _vestedAmount(schedule);
        uint256 unreleased = vested - schedule.released;
        require(unreleased > 0, "No tokens to release");

        schedule.released += unreleased;
        _transfer(address(this), schedule.beneficiary, unreleased);

        emit VestingTokensReleased(_scheduleId, schedule.beneficiary, unreleased);
    }

    function revokeVestingSchedule(bytes32 _scheduleId, bool _burnUnvested)
        external
        onlyRole(DAO_ROLE)
    {
        VestingSchedule storage schedule = vestingSchedules[_scheduleId];
        require(schedule.revocable, "Not revocable");
        require(!schedule.revoked, "Already revoked");

        schedule.revoked = true;

        // Release vested portion
        uint256 vested = _vestedAmount(schedule);
        uint256 unreleasedVested = vested - schedule.released;
        if (unreleasedVested > 0) {
            schedule.released += unreleasedVested;
            _transfer(address(this), schedule.beneficiary, unreleasedVested);
            emit VestingTokensReleased(_scheduleId, schedule.beneficiary, unreleasedVested);
        }

        // Unvested portion
        uint256 unvested = schedule.totalAmount - vested;
        if (_burnUnvested && unvested > 0) {
            _burn(address(this), unvested);
        }

        emit VestingRevoked(_scheduleId, _burnUnvested ? unvested : 0);
    }

    function _vestedAmount(VestingSchedule memory schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.start + schedule.cliff) {
            return 0;
        }
        if (block.timestamp >= schedule.start + schedule.duration) {
            return schedule.totalAmount;
        }
        uint256 elapsed = block.timestamp - schedule.start;
        return (schedule.totalAmount * elapsed) / schedule.duration;
    }

    /*///////////////////////////////////////////////////////////////
                      COMMUNITY POOL DEPLETION
    //////////////////////////////////////////////////////////////*/
    function setCommunityPoolDepleted(bool _status) external onlyRole(DAO_ROLE) {
        communityPoolDepleted = _status;
        emit CommunityPoolDepletedSet(_status);
    }

    /*///////////////////////////////////////////////////////////////
                     INFLATION (Set Later)
    //////////////////////////////////////////////////////////////*/
    /**
     * @dev applyInflation() mints new tokens if the pool is depleted, 
     *      the interval has passed, and inflationBps > 0.
     */
    function applyInflation() external onlyRole(DAO_ROLE) {
        require(communityPoolDepleted, "Not depleted");
        require(inflationBps > 0 && inflationInterval > 0, "Inflation not configured");
        require(block.timestamp >= lastInflationApplied + inflationInterval, "Interval not passed");

        uint256 newTokens = (totalSupply() * inflationBps) / 10000;
        _mint(address(this), newTokens);
        lastInflationApplied = block.timestamp;

        emit InflationApplied(newTokens, totalSupply());
    }

    /**
     * @notice Let's group setting inflation parameters in one function,
     *         or you could keep them separate like updateInflationRate & updateInflationInterval.
     */
    function setInflationParameters(uint256 _bps, uint256 _interval) external onlyRole(DAO_ROLE) {
        // e.g., 100 => 1%
        inflationBps = _bps;
        inflationInterval = _interval;
        emit InflationRateUpdated(_bps);
        emit InflationIntervalUpdated(_interval);
    }

    /*///////////////////////////////////////////////////////////////
                        OVERRIDE DECIMALS
    //////////////////////////////////////////////////////////////*/
    function decimals() public view override returns (uint8) {
        return _customDecimals;
    }

    /*///////////////////////////////////////////////////////////////
                        BURN
    ///////////////////////////////////////////////////////////////*/
    function burnFrom(address account, uint256 amount) external {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "Burn amount exceeds allowance");

        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }
             

    /*///////////////////////////////////////////////////////////////
                 PERMIT (EIP-2612) FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    // Inherited from ERC20Permit:
    // - permit()
    // - nonces()
    // - DOMAIN_SEPARATOR()

    /*///////////////////////////////////////////////////////////////
                 DAO/ADMIN HOUSEKEEPING
    //////////////////////////////////////////////////////////////*/
    /**
     * @notice If you need to move tokens (DXZ or other ERC20) from the contract
     *         under the DAO's control, you can call adminWithdraw(...).
     *         E.g., distributing TGE unlock portion.
     */
    function adminWithdraw(address _token, address _to, uint256 _amount) external onlyRole(DAO_ROLE) {
        require(_to != address(0), "Invalid recipient");

        if (_token == address(this)) {
            _transfer(address(this), _to, _amount);
        } else {
            IERC20(_token).transfer(_to, _amount);
        }
    }
}
