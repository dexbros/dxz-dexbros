/** @format */

import * as React from "react";
import { Link } from "react-router-dom";
// import "./Block.css";
import { useNavigate } from "react-router-dom";

const BlockCastHeader = ({ title, menu }) => {
  const [openMenu, setOpenMenu] = React.useState("");

  const navigate = useNavigate();
  const goBack = () => {
    navigate("/blockcast");
  };

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenMenu(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <div className='block_main_header'>
      {/* <Link to='/'>
        <HomeIcon className='header_home_icon' />
      </Link>

      <Link to='/' className='header_logo_btn'>
        <LogoIcon className='header_logo_icon header_icon_icon' />
      </Link> */}

      {/* Menu */}
      <div>
        <button className='nav_button' onClick={() => navigate("/menu")}>
          <span class='icon-menu'></span>
          <br />
          {/* <span className='nav_text'>Menu</span> */}
        </button>

        {/* <button className='more_header_btn' onClick={() => setOpenMenu(true)}>
          <MoreIcon className='header_home_icon ' />
        </button> */}
        {openMenu && (
          <div className='header_menu' ref={wrapperRef}>
            <li className='menu_list'>Privacy</li>
            <li className='menu_list'>Report</li>
            <li className='menu_list'>FAQ</li>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockCastHeader;
