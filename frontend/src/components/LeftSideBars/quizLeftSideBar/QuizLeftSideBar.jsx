import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { userLogout } from '../../../redux/user/user.actions';

const QuizLeftSideBar = ({ notifications, user, logout }) => {
    const handleLogout = (e) => {
		e.preventDefault();
		logout();
	}
    return <>
        <nav className='col-2 d-none d-md-flex'>
            <Link className='blue' to='/'>
                <i className='fas fa-dove'></i>
            </Link>
            <Link to='/'>
                <i className='fas fa-home'></i>
            </Link>
            <Link to='/search'>
                <i className='fas fa-search'></i>
            </Link>
            <Link to='/notifications'>
                <i className='fas fa-bell'></i>
                <span id={`notificationBadge`} className={` ${notifications.filter(n => n.opened == false).length > 0 ? 'active' : ''}`}>
                    {
                        notifications.filter(n => n.opened == false).length
                    }
                </span>
            </Link>
            <Link to='/messages'>
                <i className='fas fa-envelope'></i>
            </Link>
            <Link to={'/profile/' + user._id}>
                <i className='fas fa-user'></i>
            </Link>
            <Link to={'/quiz-overview'}>
                <i className='fa fa-gamepad'></i>
            </Link>
            <Link to='/my-active-contest'>
                <i className='fas fa-play'></i>
            </Link>
            <Link to={'/sports'}>
                <i className='fa fa-ban'></i>
            </Link>
            <Link onClick={handleLogout} to='/logout'>
                <i className='fas fa-list-ul'></i>
            </Link>
            <Link onClick={handleLogout} to='/logout'>
                <i className='fas fa-sign-out-alt'></i>
            </Link>
        </nav>
    </>
}

const mapStateToProps = state => ({
    notifications: state.notification.notifications,
    user: state.user.user
})

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(userLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(QuizLeftSideBar);