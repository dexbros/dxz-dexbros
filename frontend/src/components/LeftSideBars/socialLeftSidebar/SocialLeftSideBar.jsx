/** @format */

import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { userLogout } from "../../../redux/user/user.actions";
import { setDrawer } from "../../../redux/page/page.actions";
import { ReactComponent as Logo } from "../../../Assets/Icons/logo.svg";

const SocialLeftSideBar = ({
  notifications,
  user,
  logout,
  setDrawer,
  isOpen,
}) => {
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  return (
    <div className='social_side_navbar'>
      {/* Logo */}
      <div className='nav_item'>
        <Link className='nav_item_link' to='/'>
          {/* <i className='fas fa-dove'></i> */}
          <Logo className='logo_icon' />
        </Link>
      </div>

      {/* Home */}
      <div className='nav_item'>
        <Link to='/' className='nav_item_link'>
          {/* <i className='fas fa-dove'></i> */}
          <span class='icon-home_two'></span>
        </Link>
      </div>

      {/* Profile */}
      <div className='nav_item'>
        <Link to={"/user/profile/" + user.handleUn} className='nav_item_link'>
          {/* <i className='fas fa-dove'></i> */}
          <span class='icon-userprofile'></span>
        </Link>
      </div>

      {/* Search */}
      <div className='nav_item'>
        <button className='nav_item_link' onClick={() => setDrawer(!isOpen)}>
          {/* <SearchLogo className='left_side_navbar_icon' /> */}
          <span class='icon search-v'></span>
        </button>
      </div>

      {/* Block */}
      <div className='nav_item'>
        <Link to='/blockcast' className='nav_item_link'>
          {/* <i className='fas fa-dove'></i> */}
          <span class='icon-cube left_side_navbar_icon'></span>
        </Link>
      </div>

      {/* Profile */}
      <div className='nav_item'>
        <Link onClick={handleLogout} to='/logout'>
          {/* <i className='fas fa-sign-out-alt'></i> */}
          <span class='icon-logout_one left_die_navbar_icon'></span>
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
  user: state.user.user,
  isOpen: state.page.isOpen,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout()),
  setDrawer: (data) => dispatch(setDrawer(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialLeftSideBar);
