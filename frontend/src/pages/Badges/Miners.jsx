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
import { getPercentager } from "../../utils/getPercentage";
import LoaderIndicator from "../../components/LoaderIndicator/LoaderIndicator";
import axios from "axios";
import CustomModal from "../../components/modal/CustomModal";

const Miners = ({ setIsFlip, user, token }) => {
  const { t } = useTranslation(["common"]);
  const [verify, setVerify] = React.useState(false);
  const [isResponse, setIsResponse] = React.useState(false);
  const [responseMsg, setResponseMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // *** get followers percentarget
  var flwr_complete = getPercentager(
    Number(user.flwr_c),
    Number(process.env.REACT_APP_CC_FLWR_COUNT_FOR_MINER)
  );
  var flwr_remaining = 100 - flwr_complete;

  // *** get posts percentage
  var post_complete = getPercentager(
    Number(user.post_c),
    Number(process.env.REACT_APP_POSTNO_FOR_MINER)
  );
  var post_remaining = 100 - post_complete;

  // *** get account age
  var account_complete = getPercentager(
    1,
    Number(process.env.REACT_APP_ACCOUNT_OLD_FOR_MINER)
  );
  var account_remaining = 100 - account_complete;

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
    <MainLayout title='Minters & Burners Circle(MBC)'>
      {verify && (
        <CustomModal
          title='Profile verification'
          onClose={handleCloseModal}
          body={
            <React.Fragment>
              {isResponse ? (
                <div className='modal_body_text'>{responseMsg}</div>
              ) : (
                <div className='modal_body_text'>
                  {t("Verify your profile by click on the verify button")}
                </div>
              )}
            </React.Fragment>
          }
          footer={
            <React.Fragment>
              {!isResponse ? (
                <div className='__modal_footer'>
                  <button
                    className={"__modal_footer_btn"}
                    onClick={() => verifyProfile()}>
                    {isLoading ? (
                      <LoadingIcon className='spinner' />
                    ) : (
                      <>Verify</>
                    )}
                  </button>
                </div>
              ) : null}
            </React.Fragment>
          }
        />
      )}
      <div className='badge_body'>
        <div>
          <ol className='badge_cc_box1'>
            {/* Followers */}
            <div className='cc_condt1'>
              <div>
                <LoaderIndicator
                  remaining={flwr_remaining}
                  complete={flwr_complete}
                />
              </div>
              <div>
                <span className='sub_header'>
                  Required{" "}
                  <b>{process.env.REACT_APP_CC_FLWR_COUNT_FOR_MINER}</b>{" "}
                  followers
                </span>
                <br />
                <span className='re_sub_header'>
                  Remaining followers{" "}
                  {user.flwr_c ? (
                    <>
                      {Number(process.env.REACT_APP_CC_FLWR_COUNT_FOR_MINER) -
                        Number(user.flwr_c)}
                    </>
                  ) : (
                    Number(process.env.REACT_APP_CC_FLWR_COUNT_FOR_MINER)
                  )}
                </span>
              </div>
            </div>

            {/* Post Count */}
            <div className='cc_condt1'>
              <div>
                <LoaderIndicator
                  remaining={account_remaining}
                  complete={account_complete}
                />
              </div>
              <div>
                <span className='sub_header'>
                  Require minimum {process.env.REACT_APP_POSTNO_FOR_MINER} posts
                </span>
                <br />
                <span className='re_sub_header'>
                  Remaining posts{" "}
                  {user.post_c ? (
                    <>
                      {Number(process.env.REACT_APP_POSTNO_FOR_MINER) -
                        user.post_c}
                    </>
                  ) : (
                    <>{Number(process.env.REACT_APP_POSTNO_FOR_MINER)}</>
                  )}
                </span>
              </div>
            </div>

            {/* Account  Age */}
            <div className='cc_condt1'>
              <div>
                <LoaderIndicator
                  remaining={account_remaining}
                  complete={account_complete}
                />
              </div>
              <div>
                <span className='sub_header'>
                  You have to loggedin for last{" "}
                  <span className='cc_count'>
                    {process.env.REACT_APP_ACCOUNT_OLD_FOR_MINER}
                  </span>{" "}
                  days.
                </span>
                <br />
                <span className='re_sub_header'>
                  Remaining Days:
                  <span className='cc_count'>
                    {Number(process.env.REACT_APP_ACCOUNT_OLD_FOR_MINER) - 1}
                  </span>
                </span>
              </div>
            </div>

            {/* Validate Email */}
            <div className='cc_condt1'>
              <div>
                <LoaderIndicator
                  remaining={user.isVerified ? 0 : 100}
                  complete={user.isVerified ? 100 : 0}
                />
              </div>
              <div>
                <span className='sub_header'>Account verification</span>
                <br />
                {user.isVerified ? (
                  <span className='re_sub_header'>
                    Your account has been verified
                  </span>
                ) : (
                  <span className='re_sub_header'>
                    You can verify your account by click on the{" "}
                    <button
                      className='email_verification_btn'
                      onClick={() => setVerify(true)}>
                      click here
                    </button>
                  </span>
                )}
              </div>
            </div>
          </ol>
        </div>
      </div>
      {user.isVerified && user.flwr_c >= 100 && user.post_c >= 100 ? (
        <div className='claim_btn_container'>
          <button className='claim_button'>Claim</button>
        </div>
      ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Miners);
