import { connect } from "react-redux";

import { Link } from 'react-router-dom';

import { userLogin } from '../../redux/user/user.actions';

function User({ userData, showFollowButton, user, token, login }) {


  const handleFollow = () =>{
    // Example POST method implementation:
    async function putData(url = '') {
        // Default options are marked with *
        const response = await fetch(url, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: 'cors'
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
    
    putData(`${process.env.REACT_APP_URL_LINK}api/users/${userData._id}/follow`)
        .then(data => {
                //console.log(data);
                login(data.user._doc, data.token);	
    }).catch(err => console.log(err));
}

    var username, isFollowing, text, buttonClass, followButton;

    username = userData.firstName + " " + userData.lastName;
    isFollowing = user.following && user.following.includes(userData._id);
    text = isFollowing ? "Following" : "Follow";
    buttonClass = isFollowing ? "followButton following" : "followButton";

    followButton = "";
    if(showFollowButton && user._id != userData._id){
        followButton = <div className="followButtonContainer">
            <button onClick={handleFollow} className={`${buttonClass}`} data-user={`${userData._id}`}>{text}</button>
        
        </div>;
    }
    
  
  return user && <div className='user'>
      <div className='userImageContainer'>
          <img src={userData.profilePic} />
      </div>
      <div className='userDetailsContainer'>
          <div className='header'>
              <Link to={`/profile/${userData._id}`}>{username}</Link>
              <span className='username'>@{userData.username}</span>
          </div>
      </div>
      {followButton}
  </div>
}

const mapStateToProps = state => ({
    user: state.user.user,
    token: state.user.token
})
  
const mapDispatchToProps = dispatch => ({
    login: (user, token) => dispatch(userLogin(user, token))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(User);
