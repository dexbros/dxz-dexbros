/** @format */

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userLogout } from "../../../redux/user/user.actions";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 1000,
  easing: "linear",
  once: true,
});

const SocialDownNav = ({ user, logout, axisValue }) => {
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };
  return (
    <div
      className={
        axisValue === "Up" ? "down_navbar_container" : "hide_down_navbar"
      }>
      <Link to='/' className='down_navbar_link'>
        <i className='fas fa-home'></i>
      </Link>
      <Link to='/messages' className='down_navbar_link'>
        <i className='fas fa-envelope'></i>
      </Link>
      <Link to={"/user/profile/" + user.handleUn}>
        <i className='fas fa-user'></i>
      </Link>
      <Link to={"/sports"} className='down_navbar_link'>
        <i className='fa fa-baseball'></i>
      </Link>
      <Link onClick={handleLogout} to='/logout' className='down_navbar_link'>
        <i className='fas fa-sign-out-alt'></i>
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  axisValue: state.page.axisValue,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialDownNav);
{
  /* <nav className='down-nav d-lg-none d-md-none d-sm-flex'>
 
</nav>; */
}
