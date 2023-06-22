/** @format */

import * as React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { setPageType } from "../../redux/page/page.actions";

import MainLayout from "../../layouts/main-layout.component";
import User from "../../components/user/user.component";

function FollowersAndFollowingPage({ user, token, setPageType }) {
  const selectedTab = useParams().tab;
  const profileId = useParams().profileId;

  const [tab, setTab] = React.useState(`${selectedTab}`);
  const [profiles, setProfiles] = React.useState(null);

  const handleTabChange = () => {
    tab === "following" ? setTab("follower") : setTab("following");
  };

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  //   React.useEffect(() => {
  //     if(user && profileId){
  //       //console.log(profileId);
  //         setProfiles(null);

  //         const url = tab === 'following' ? `${process.env.REACT_APP_URL_LINK}api/users/${profileId}/following` : `${process.env.REACT_APP_URL_LINK}api/users/${profileId}/followers`;

  //           async function getUsers(url = '') {
  //               // Default options are marked with *
  //               const response = await fetch(url, {
  //               method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //               mode: 'cors', // no-cors, *cors, same-origin
  //               headers: {
  //                   'Authorization': 'Bearer ' + token
  //                   // 'Content-Type': 'application/x-www-form-urlencoded',
  //               }
  //               // body data type must match "Content-Type" header
  //                   });
  //                   return response.json(); // parses JSON response into native JavaScript objects
  //           }

  //           getUsers(url)
  //           .then(data => {
  //               //console.log(data);
  //               tab == 'following' ? setProfiles(data.following) : setProfiles(data.followers); // JSON data parsed by `data.json()` call
  //           }).catch(err => console.log(err));
  //     }
  // }, [user, tab, profileId]);

  return (
    user && (
      <MainLayout title='Follower-Following'>
        {/* <div className='tabsContainer'>
          <button
            onClick={handleTabChange}
            className={`tab ${tab === "following" ? "active" : ""}`}>
            <span>Following</span>
          </button>
          <button
            onClick={handleTabChange}
            className={`tab ${tab === "follower" ? "active" : ""}`}>
            <span>Followers</span>
          </button>
        </div>
        <div className='resultsContainer'>
          {profiles &&
            profiles.map((profile) => {
              return (
                <User
                  key={profile._id}
                  userData={profile}
                  showFollowButton={true}
                />
              );
            })}
        </div> */}
        Followers
      </MainLayout>
    )
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowersAndFollowingPage);
