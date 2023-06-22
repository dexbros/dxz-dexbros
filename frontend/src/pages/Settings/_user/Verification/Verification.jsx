import React from "react";
import { connect } from "react-redux";
import MainLayout from "../../layouts/main-layout.component";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import { userLogin, addFollower, removeFollower, updateUser } from "../../redux/user/user.actions";
import { ReactComponent as CompleteIcon } from "../../Assets/Icons/complete.svg";



const Validation = ({ user, token, login }) => {
  // console.log(token)
  const { id } = useParams();
  const navigate = useNavigate();
  const [responseMsg, setResponseMsg] = React.useState("");
  const [isResponse, setIsResponse] = React.useState(true);
  const [isDisiable, setIsDisble] = React.useState(true)
  
  const verification = () => {
    console.log("Call")
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}api/users/verify/key/${id}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setIsResponse(true);
        setResponseMsg(response.data.msg);
        login(response.data.user, token);
        setIsDisble(false);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  React.useEffect(() => {
    verification();
  }, [])
  const navigateToProfile = () => {
    navigate(`/user/profile/${user.handleUn}`)
  }
  return (
    <MainLayout title="Profile verification">
      <div className="verification_container">
        
        {
          !isResponse ?
            <div className="verification_box">
              <p className="verification_text">Verify your profile by click on the button! </p>
              <button className="verification_btn"onClick={verification}>Verification</button>
            </div> :
            <div className="verification_box">
              <div className="complete_icons_container">
                <CompleteIcon className="complete_icons" />
              </div>
              <p className="verification_text">Profile Verification completed</p>
              <button onClick={navigateToProfile} className={isDisiable ? "verification_btn_done disable_verification_btn_done" : "verification_btn_done"} disabled={isDisiable}>Back to profile</button>
            </div>
        }
      </div>
    </MainLayout>
  )
};

const navigateToProfile = () => {}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Validation);