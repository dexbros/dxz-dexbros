import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { userLogout } from '../../../redux/user/user.actions';

const QuizDownNav = ({ user, logout }) => {
    const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}
    return <nav className='down-nav d-lg-none d-md-none d-sm-flex'>
        <Link to='/'>
            <i className='fas fa-home'></i>
            <span>Home</span>
        </Link>
        <Link to='/my-active-contest'>
            <i className='fas fa-play'></i>
            <span>Active</span>
        </Link>
        <Link to={'/sports'}>
            <i className='fa fa-ban'></i>
            <span>Ended</span>
        </Link>
        <Link onClick={handleLogout} to='/logout'>
            <i className='fas fa-list-ul'></i>
            <span>More</span>
        </Link>
    </nav>
}

const mapStateToProps = state => ({
    user: state.user.user
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userLogout())
})


export default connect(mapStateToProps, mapDispatchToProps)(QuizDownNav);