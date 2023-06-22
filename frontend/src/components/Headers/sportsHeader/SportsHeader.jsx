import * as React from 'react';
import { Link } from "react-router-dom";

import Menu from '../../menu/Menu';

const SportsHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

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

    return <div className='titleContainer'>
        <Link className="logo" to={`/`}>
            <i className='fas fa-dove'></i>
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
            <button onClick={() => isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true)}>
                <i className='fa fa-bars'></i>
            </button>
            {isMenuOpen && <div className="menu-popup" >
                <Menu />
            </div>}
        </div>
    </div>
} 

export default SportsHeader;