import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { userLogin } from "../../redux/user/user.actions";
import { connect } from 'react-redux';
import "./User.css"

const UserComponent = ({ data, token, user, userData, login }) => {
  console.log(userData)

  const clickHandler = (userId) => {
    // Example POST method implementation:
    async function putData(url = "") {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: "cors",
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    putData(`${process.env.REACT_APP_URL_LINK}api/users/${userId}/follow`)
      .then((data) => {
        //console.log(data);
        // if (profile._id != user._id) {
        //   socket.emit("notification recieved", profile._id);
        // }
        console.log(data)
        login(data.user._doc, data.token);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="__user_card">
      <div>
        <img src={userData.p_i} className="follower_profilePic" />
        <Link to={`/user/profile/${userData.d_u}`} className="__user_card_name">
          {userData.f_n} {" "} {userData.l_n}
        </Link>

        <span className='__user_card_username'>{userData.d_u}</span>
      </div>
      {/* {
        user._id.toString() !== userData.u_id &&
        <button className='follow_btn'>
          {
            user.following.includes(userData._id.toString()) ? <>Followed</> : <>Follow</>
          }
        </button>
      } */}
      {/* {
        userData.u_id !== user._id &&
        <button className='follow_btn' onClick={() => clickHandler(user._id)}>
            {
              userData.followers.includes(user._id.toString()) ? <>Followed</> : <>Follow</>
            }
        </button>
      } */}
    </div>
  )
};

const mapStateToProps = state => ({
  user: state.user.user,
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
    login: (user, token) => dispatch(userLogin(user, token)),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);