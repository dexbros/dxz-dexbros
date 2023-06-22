import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin } from "../../redux/user/user.actions";
import Layout from "../../layouts/main-layout.component";
import "./Style.css"
import { useParams } from 'react-router-dom';
import UserComponent from '../../components/user/UserComponent';
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle"

const FollowingFollowers = ({
  user,
  token,
  login, setPageType
}) => {
  const handleUn = useParams().handleUn
  const [activeTab, setActiveTab] = useState('followers')
  const [data, setData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // console.log(user);
  React.useLayoutEffect(() => {
    setPageType('social');
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/users/${handleUn}?key=${activeTab}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (activeTab === 'followers') {
          console.log("Followers");
          console.log(result)
          setFollowers(result.followers);
        } else {
          console.log(result)
          setFollowings(result.following)
        }
      })
      .catch(error => console.log('error', error));
  }, [activeTab]);

  const clickHandler = (userId) => {
    alert(userId)
    // Example POST method implementation:
      // async function putData(url = "") {
      //   // Default options are marked with *
      //   const response = await fetch(url, {
      //     method: "PUT", // *GET, POST, PUT, DELETE, etc. // include, *same-origin, omit
      //     headers: {
      //       Authorization: "Bearer " + token,
      //       "Content-Type": "application/json",
      //       // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     mode: "cors",
      //   });
      //   return response.json(); // parses JSON response into native JavaScript objects
      // }

      // putData(`http://localhost:5000/api/users/${userId}/follow`)
      //   .then((data) => {
      //     //console.log(data);
      //     // if (profile._id != user._id) {
      //     //   socket.emit("notification recieved", profile._id);
      //     // }
      //     login(data.user._doc, data.token);
      //   })
      //   .catch((err) => console.log(err));
  };

  return (
    <Layout goBack={true} title={
      <HeaderTitle
        content={"Following-Followers"}
      />
    }>
      <div className='_profile_followers_tab_container'>
        <div
          className={activeTab === 'followers' ?
            'followers_tab_container active_tab' :
            'followers_tab_container'}
          onClick={() => setActiveTab('followers')}>
          Followers
        </div>

        <div className={activeTab === 'following' ? 'followers_tab_container active_tab' : 'followers_tab_container'} onClick={() => setActiveTab('following')}>Following</div>
      </div>

      <>
        {
          activeTab === 'followers' ?
            <>
              {
                (followers || []).length > 0 ?
                  <>
                    {
                      followers.map(follower => (
                        <UserComponent userData={follower} key={follower._id} clickHandler={clickHandler} />
                      ))
                    }
                  </> : <>No data found</>
              }
            </> :
            <>
              {
                (followings || []).length > 0 ?
                  <>
                    {
                      followings.map(follow => (
                        <UserComponent userData={follow} key={follow._id} clickHandler={clickHandler} />
                      ))
                    }
                  </> : <>No data found</>
              }
            </>
        }
      </>
    </Layout>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowingFollowers);
