import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../../Assets/Icons/logo.svg";
import Menu from '../../menu/Menu';


const DefaultHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [change, setChange] = React.useState(false);
  const [title, setTitle] = useState("")

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsMenuOpen(false);
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
    <div className='titleContainer'>
      {
        !change ?
          <>
            <Link className="logo" to={`/`}>
              {/* <i className='fas fa-dove'></i> */}
              <Logo className='header_logo_icon' />
            </Link>

            <div className="searchBarContainer searchBarContainer__header">
              <i className="fas fa-search"></i>
              <input id="searchBox" type="text" name="searchBox" placeholder="Search" />
              <select>
                <option>Events</option>
                <option>Users</option>
                <option>Posts</option>
              </select>
            </div>

            <div className="header-options" ref={wrapperRef}>
              <Link to={'/notifications'}>
                <i className='fas fa-bell'></i>
              </Link>
              <button onClick={() => navigate("/menu")}>
                <i className='fa fa-bars'></i>
              </button>
            </div>
          </> : null
      }
    </div>
  )
};

export default DefaultHeader;