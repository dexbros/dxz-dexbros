import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { userLogout } from '../../../redux/user/user.actions';

const SportsDownNav = ({ user, logout }) => {
    const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}
    return <nav className='down-nav d-lg-none d-md-none d-sm-flex'>
        <Link to='/'>
            <i className='fas fa-home'></i>
        </Link>
        <Link to='/messages'>
            <i className='fas fa-envelope'></i>
        </Link>
        <Link to={'/profile/' + user._id}>
            <i className='fas fa-user'></i>
        </Link>
        <Link to={'/sports'}>
            <i className='fa fa-baseball'></i>
        </Link>
        <Link onClick={handleLogout} to='/logout'>
            <i className='fas fa-sign-out-alt'></i>
        </Link>
    </nav>
}

const mapStateToProps = state => ({
    user: state.user.user
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userLogout())
})


export default connect(mapStateToProps, mapDispatchToProps)(SportsDownNav);