# Dexbros Token Unlocking & Vesting Schedule

## **Version:** 1.0

## **Network:** Ethereum L1 (Supply Governance) + L2 (Utility & Circulation)

---

## **📌 1. Introduction**

Dexbros ($DXZ) follows a structured unlocking and vesting mechanism designed to:

✔️ **Fair & Predictable Distribution** – Prevents token dumping and market instability.  
✔️ **Long-Term Incentive Alignment** – Core contributors, investors, and users benefit gradually.  
✔️ **Governance Oversight** – DAO-managed allocations for sustainability and decentralization.

At TGE (**Token Generation Event**), **1.21 trillion DXZ tokens** are minted on **Ethereum L1**, with controlled releases to **L2** for usage and circulation.

---

## **📌 2. Token Allocation & Unlocking Summary**

The **initial 1.21 trillion $DXZ** is divided across multiple allocations, each with a distinct vesting and unlocking schedule:

| **Category**                      | **% of Total Supply** | **Tokens (DXZ)** | **Unlocking & Vesting Schedule**                                       |
| --------------------------------- | --------------------- | ----------------- | ---------------------------------------------------------------------- |
| **Private Sale / Seed Investors** | 12%                   | 145.2B             | **20% at TGE, cliff 9-month, remainder vests monthly over 24 months**                 |
| **Public Sale / IDO / IEO**       | 8%                    | 96.8B             | **25% at TGE, remainder vests linearly over 9 months**                 |
| **Team & Advisors**               | 15%                   | 181.5B            | **12-month cliff, then vests monthly over 36 months**                  |
| **Ecosystem & Partnerships**      | 10%                   | 121B              | **Fully locked at TGE, released via DAO proposals**                    |
| **Community & User Growth**       | 16%                   | 193.6B            | **Fully unlocked at TGE for immediate use**                            |
| **Staking & Validator Rewards**   | 7%                    | 84.7B             | **Gradual emission per block, transitions to inflation-based rewards** |
| **Liquidity & Market Making**     | 12%                   | 145.2B            | **30% unlocked at TGE, remainder released strategically by DAO**       |
| **Foundation / Treasury**         | 15%                   | 181.5B            | **DAO-controlled, unlocked based on proposals**                        |
| **Unallocated Reserve**           | 5%                    | 60.5B             | **TBD (Governance-controlled usage)**                                  |

---

## **📌 3. Unlocking & Vesting Details Per Allocation**

### **🔴 Liquidity & Market Making (12%)**
✅ **30% unlocked at TGE.**  
✅ **Remaining 70% is controlled by DAO for strategic release.**  
✅ **Supports liquidity across multiple exchanges (DEX & CEX).**  
✅ **Ensures market stability & prevents excessive volatility.**  

#### **Strategic Release Plan:**
- **DAO votes on liquidity release schedules.**
- **Considerations for multiple exchange listings.**
- **Funds for market-making partnerships to stabilize price action.**

---

## **📌 4. Inflation-Based Minting (Post 16% Depletion)**

📌 Once the **Community & User Growth** pool is depleted:

- **0.75% inflation of total supply (1.21T DXZ) every 21 days.**
- **Supports staking, validator rewards, social incentives.**

#### **Example Timeline:**

| Cycle   | Total Supply | Inflation (0.75%) | New Circulating Supply |
| ------- | ------------ | -------------- | ---------------------- |
| Cycle 1 | 1.21T DXZ   | 9.075B DXZ     | 1.219T DXZ           |
| Cycle 2 | 1.219T DXZ | 9.075B DXZ    | 1.228T DXZ           |

---

## **📌 5. Smart Contract Implementation & Address Registration**

### **Private Sale Unlocking Method:**
🔹 Investors’ addresses **will be registered manually post-deployment.**  
🔹 Smart contract will release tokens based on the **vesting schedule.**  
🔹 DAO can **update investor addresses if required.**  

✅ **Why Manual Registration?**
- Flexibility to add/change investor addresses **after TGE.**  
- Ensures compliance with **legal and KYC requirements.**  
- Allows **strategic token allocations** based on governance decisions.

---

## **📌 6. Governance Control & Adjustments**

✔️ **The DAO can vote to:**  
- Adjust inflation rate (if necessary).  
- Reallocate locked token pools.  
- Burn excess supply to control inflation.  
- Adjust liquidity release schedules based on exchange needs.

---

## **📌 7. Summary**

✔️ **1.21T DXZ minted at TGE, distributed per allocation rules.**  
✔️ **100% of Community Growth unlocked at TGE → funds user incentives.**  
✔️ **After exhaustion, 0.75% inflation every 21 days.**  
✔️ **Team & Investors vest gradually to prevent large sell-offs.**  
✔️ **DAO governs Treasury, Ecosystem Funds, & future allocations.**  
✔️ **Liquidity release is controlled by the DAO to align with market conditions.**

---

## **📌 8. Next Steps**
- ✅ Final Review & Adjustments  
- ✅ Implement in Smart Contracts  
- ✅ Deploy & Secure DAO Oversight





# 📄 Deployment Summary (Sepolia Testnet)

Deployed with signer:

```
0x80c8E4481Eb69aee0C13b107c06C6770fAD9a57a
```

---

## 📦 Deployed Contracts

| **Contract / Pool**              | **Address**                                   |
| --------------------------------- | --------------------------------------------- |
| **DexbrosToken**                  | `0xB25D435FF7A2B23430558dFBDB7Dc6ca703A10D3` |
| **VestingVault**                  | `0x709230016f2ddf02CF6a74Dca7dcc1254bbe59c4` |
| **EmissionController**            | `0x56AAD61BD104cd335878080812519a4C1832B8c5` |
| **ProposalManager**               | `0x964Fc1f65afE44316be70E73b31Bc6B08D335449` |
| **Private Sale Pool**             | `0x96DC1fCba9c1c77b58E653420c330d793a55af33` |
| **Public Sale Pool**              | `0x302fD1a8ef4B41449dc31DEaAfeBcBc1BE300AaD` |
| **Team & Advisors Pool**          | `0x9692e90A85F11d2860Ce2cA424e5f67A4fEAf503` |
| **Ecosystem Pool**                | `0x81636d07d1b021F32B33eeDe026A2640b1250E58` |
| **Community Growth Pool**         | `0xF9E651b2303Bd6cE987151c8F8F3Fd2C8132D553` |
| **Staking Rewards Pool**          | `0x72b12756610a3E8943e56D9396c098d64bf31f1e` |
| **Liquidity Pool**                | `0x0f35Cd0C25e197Bf4087f14864cc461DE59F76fC` |
| **Foundation Pool**               | `0xefa240A0cC9c3ee0D4f422488E196AD58a6b298b` |
| **Reserve Pool**                  | `0x7a84Ae3ab8D18DDFbcc995FF2e60a64dbd59C92F` |

---

## 🔑 Roles Granted

| **Action**                                        | **Recipient**               |
| ------------------------------------------------- | ----------------------------- |
| Granted `EMISSION_ROLE`                           | EmissionController            |
| Granted `WITHDRAW_ROLE`                           | ProposalManager               |
| Granted `WITHDRAW_ROLE`                           | VestingVault                  |
| Granted `DAO_ROLE` on VestingVault                 | DexbrosToken                  |
| Granted `WITHDRAW_ROLE`                           | Deployer                      |
| Granted `EMIT_ROLE`                               | Deployer                      |

---

## 👥 DAO Members Assigned

The following addresses were assigned `DAO_ROLE` across EmissionController, VestingVault, and ProposalManager:

```
- 0x80c8E4481Eb69aee0C13b107c06C6770fAD9a57a
- 0xAb36240F255950BB08b51fC8D8ccbf6a13AB284B
- 0x46319f538db66a170343668E6f32b2BD99EC8e61
```

---

## 🪙 Initial Token Seeding (DXZ)

| **Pool**                     | **Amount Seeded** |
| ----------------------------- | ----------------- |
| Private Sale                  | 145,200,000,000 DXZ |
| Public Sale                   | 96,800,000,000 DXZ |
| Team & Advisors               | 181,500,000,000 DXZ |
| Ecosystem & Partnerships      | 121,000,000,000 DXZ |
| Community & User Growth       | 193,600,000,000 DXZ |
| Staking & Validator Rewards   | 84,700,000,000 DXZ |
| Liquidity & Market Making     | 145,200,000,000 DXZ |
| Foundation / Treasury         | 181,500,000,000 DXZ |
| Reserve                       | 60,500,000,000 DXZ |

---

✅ Deployment addresses saved in:
```
deployment/addresses.json
```



================================================================================
            VESTING EXAMPLE: 60% OF 1000 TOKENS WITH A 30-DAY CLIFF, FULL VEST AT 90 DAYS
            ================================================================================

                // Total slice to vest: 
                uint256 totalAmount = 1000;
                uint256 vestAmt     = (totalAmount * 60) / 100;    // 600 tokens (60% of 1000)

                // Schedule parameters:
                uint64  cliff    = 30 days;   // nothing vests until 30 days after start
                uint64  duration = 90 days;   // linear vest from t=0 → t=90 days

            Vested amount over time (via (vestAmt * elapsed) / duration):

                • Day 0-29    → 0 tokens vested
                • Day 30      → (600 * 30) / 90 = 200 tokens vested
                • Day 60      → (600 * 60) / 90 = 400 tokens vested
                • Day 90      → (600 * 90) / 90 = 600 tokens vested (fully unlocked)
                • Day 90+     → 600 tokens available (no further vesting)

            To schedule this on-chain:

                dxz.withdrawAndVest(
                    vestingVault,
                    beneficiary,
                    vestAmt,     // 600
                    cliff,       // 30 days
                    duration,    // 90 days
                    revocable    // e.g. false
                );

            After that, the beneficiary can call `vestingVault.releaseVestedTokens(id)` at any time
            to pull out the vested portion according to the above schedule.


