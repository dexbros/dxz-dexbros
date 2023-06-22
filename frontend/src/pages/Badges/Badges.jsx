/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import {
  userLogin,
  addFollower,
  removeFollower,
  updateUser,
} from "../../redux/user/user.actions";
import MainLayout from "../../layouts/main-layout.component";
import { useTranslation } from "react-i18next";
import { ReactComponent as CompleteIcon } from "../../Assets/Icons/complete.svg";
// import { checkFollowersCount } from "../../utils/Badges/checkFollowerCount";
import ContentCreator from "./ContentCreator";
import Miners from "./Miners";
import Burners from "./Burners";
import { useNavigate } from "react-router";
import { BiAddToQueue } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import PublicFigure from "./PublicFigure";
import Subscription from "./Subscription";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import BadgeSkeleton from "../../components/SkeletonLoading/BadgeSkeleton";

const Badges = ({
  user,
  followers,
  following,
  addFollower,
  removeFollower,
  token,
  login,
  posts,
  newPosts,
  pinnedPost,
  setPinnedPost,
  setUpdatedUser,
  update,
  setPageType,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["common"]);
  const [profile, setProfile] = React.useState(null);
  const [isCollapse1, setIsCollapse1] = React.useState(false);
  const [isCollapse2, setIsCollapse2] = React.useState(false);

  React.useLayoutEffect(() => {
    setPageType("badge");
  });

  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}profile/fetch/${user.handleUn}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.handleUn === user.handleUn) {
          login(result, token);
          setProfile(result);
        } else {
          setProfile(result);
        }
      })
      .catch((error) => console.log("error", error));
  }, [token]);

  // *** Verify profile
  const verifyProfile = () => {
    setIsLoading(true);
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_URL_LINK}api/users/verify/profile/`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setIsResponse(true);
        setResponseMsg(response.data.msg);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleCloseModal = () => {
    setVerify(false);
  };

  return (
    <MainLayout title='Badges'>
      {profile ? (
        <div className='badges_container'>
          {/* Mile stone container */}
          <div className='main_section'>
            <div className='section'>
              <p className='section_header'>{t("Mile stone")}</p>
            </div>

            {/* Badge Inner section */}
            <div className='badge_inner_section'>
              {/* Governance Circle Members */}
              <div className='badge_section' onClick={() => navigate("/gcm")}>
                <div className='section_one'>
                  <span>
                    <CompleteIcon className='badge_icon' />
                  </span>
                  <div className='text_section'>
                    <span className='text_section_header'>
                      Governance Circle Members
                    </span>
                    <br />
                    <span className='text_section_sub'>
                      Badges for Governance Circle Members
                    </span>
                  </div>
                </div>
                <button>
                  <span class='icon-forward_circle'></span>
                </button>
              </div>

              {/* Content creator */}
              <div
                className='badge_section'
                onClick={() => navigate("/content_cretor")}>
                <div className='section_one'>
                  <span>
                    <CompleteIcon className='badge_icon' />
                  </span>
                  <div className='text_section'>
                    <span className='text_section_header'>Content creator</span>
                    <br />
                    <span className='text_section_sub'>
                      Badges for Content creator
                    </span>
                  </div>
                </div>
                <button>
                  <span class='icon-forward_circle'></span>
                </button>
              </div>

              {/* Miners Burners */}
              <div className='badge_section' onClick={() => navigate("/miner")}>
                <div className='section_one'>
                  <span>
                    <CompleteIcon className='badge_icon' />
                  </span>
                  <div className='text_section'>
                    <span className='text_section_header'>Miners/Burners</span>
                    <br />
                    <span className='text_section_sub'>
                      Badges for Miners/Burners
                    </span>
                  </div>
                </div>
                <button>
                  <span class='icon-forward_circle'></span>
                </button>
              </div>
            </div>
          </div>

          {/* Pro user container */}
          <div
            className='section'
            onClick={() => setIsCollapse1((prev) => !prev)}>
            <p className='section_header'>{t("Subscription")}</p>
            <span>
              {isCollapse1 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
            </span>
          </div>
          {isCollapse1 && <Subscription user={user} token={token} />}

          {/* Public figure */}
          <div
            className='section'
            onClick={() => setIsCollapse2((prev) => !prev)}>
            <p className='section_header'>{t("Public Figure")}</p>
            <span>
              {isCollapse2 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
            </span>
          </div>
          {isCollapse2 && <PublicFigure user={user} token={token} />}
        </div>
      ) : (
        <BadgeSkeleton />
      )}
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  following: state.user.following,
  update: state.user.updateUser,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  addFollower: (data) => dispatch(addFollower(data)),
  removeFollower: (data) => dispatch(removeFollower(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Badges);
