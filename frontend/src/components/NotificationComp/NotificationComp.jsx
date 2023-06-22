/** @format */

import React from "react";
import { connect } from "react-redux";
import UserAvatar from "../../Assets/userAvatar.webp";
import { useNavigate } from "react-router-dom";
import { AiFillHeart, AiFillDislike } from "react-icons/ai";
import { BsEmojiLaughingFill, BsFillEmojiAngryFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import timeDifference from "../../utils/getCreateTime";

const NotificationComp = ({ data, token }) => {
  // console.log(token);
  const navigate = useNavigate();

  const handleRedirectToPost = (data) => {
    navigate(`/full/post/view/${data.id}`);
    viewNotification(data.ti);
  };

  // viewed notification
  const viewNotification = (id) => {
    var axios = require("axios");

    var config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/notifications/update/view/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Redirect to profile page
  const handleRedirectToProfile = (data) => {
    navigate(`/user/profile/${data.wo}`);
    viewNotification(data.ti);
  };

  const handleRedirectToGroup = (data) => {
    navigate(`/group/full/post/${data.id}`);
    viewNotification(data.ti);
  };
  return (
    <React.Fragment>
      {data.ty === 1 ? (
        // Post reaction notification
        <div
          className={
            data.vi === 2
              ? "post_notification view_notification"
              : "post_notification"
          }
          onClick={() => handleRedirectToPost(data)}>
          <div className='noti_box'>
            <div className='noti_user_container'>
              <img src={data.pi || UserAvatar} className='noti_user_avatar' />
              {data.cat === 1 && <AiFillHeart className='noti_heart' />}
              {data.cat === 3 && (
                <BsEmojiLaughingFill className='laugh_emoji' />
              )}
              {data.cat === 2 && <AiFillDislike className='dislike_emoji' />}
              {data.cat === 4 && (
                <BsFillEmojiAngryFill className='dislike_emoji' />
              )}
            </div>
            <div className='noti_text'>
              <span className='noti_user_name'>{data.nm} </span>
              <span>is react on your post.</span>
              <br />
              <span className='noti_time'>
                {timeDifference(new Date(), new Date(data.ti))} ago
              </span>
              <div className='noti_badge' data-label='Social' />
            </div>
          </div>
        </div>
      ) : (
        // Post Comment notification
        <React.Fragment>
          {data.ty === 2 ? (
            <div
              className={
                data.vi === 2
                  ? "post_notification view_notification"
                  : "post_notification"
              }
              onClick={() => handleRedirectToPost(data)}>
              <div className='noti_box'>
                <div className='noti_user_container'>
                  <img
                    src={data.pi || UserAvatar}
                    className='noti_user_avatar'
                  />
                  {/* <AiFillHeart className='noti_heart' /> */}
                </div>
                <div className='noti_text'>
                  <span className='noti_user_name'>{data.nm} </span>
                  <span>is comment on your post.</span>
                  <br />
                  <span className='noti_time'>
                    {timeDifference(new Date(), new Date(data.ti))} ago
                  </span>

                  <div className='noti_badge' data-label='Social' />
                </div>
              </div>
            </div>
          ) : (
            // Follow following notification
            <React.Fragment>
              {data.ty === 3 ? (
                <div
                  className={
                    data.vi === 2
                      ? "post_notification view_notification"
                      : "post_notification"
                  }
                  onClick={() => handleRedirectToProfile(data)}>
                  <div className='noti_box'>
                    <div className='noti_user_container'>
                      <img
                        src={data.pi || UserAvatar}
                        className='noti_user_avatar'
                      />
                      <FaUserFriends className='dislike_emoji' />
                    </div>
                    <div className='noti_text'>
                      <span className='noti_user_name'>{data.nm} </span>start
                      following you.
                      <br />
                      <span className='noti_time'>
                        {timeDifference(new Date(), new Date(data.ti))} ago
                      </span>
                      <div
                        className='noti_badge follow_badge'
                        data-label='Social'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Post comment like dialike notification
                <React.Fragment>
                  {data.ty === 4 ? (
                    <div
                      className={
                        data.vi === 2
                          ? "post_notification view_notification"
                          : "post_notification"
                      }
                      onClick={() => handleRedirectToPost(data)}>
                      <div className='noti_box'>
                        <div className='noti_user_container'>
                          <img
                            src={data.pi || UserAvatar}
                            className='noti_user_avatar'
                          />
                          {/* <AiFillHeart className='noti_heart' /> */}
                        </div>
                        <div className='noti_text'>
                          <span className='noti_user_name'>{data.nm} </span>
                          <span>is react on your comment.</span>
                          <br />
                          <span className='noti_time'>
                            {timeDifference(new Date(), new Date(data.ti))} ago
                          </span>
                          <div className='noti_badge' data-label='Social' />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <React.Fragment>
                      {data.ty === 5 ? (
                        <div
                          className={
                            data.vi === 2
                              ? "post_notification view_notification"
                              : "post_notification"
                          }
                          onClick={() => handleRedirectToPost(data)}>
                          <div className='noti_box'>
                            <div className='noti_user_container'>
                              <img
                                src={data.pi || UserAvatar}
                                className='noti_user_avatar'
                              />
                              {/* <AiFillHeart className='noti_heart' /> */}
                            </div>
                            <div className='noti_text'>
                              <span className='noti_user_name'>{data.nm} </span>
                              <span>is reply your comment.</span>
                              <br />
                              <span className='noti_time'>
                                {timeDifference(new Date(), new Date(data.ti))}{" "}
                                ago
                              </span>
                              <div className='noti_badge' data-label='Social' />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <React.Fragment>
                          {data.ty === 6 ? (
                            <div
                              className={
                                data.vi === 2
                                  ? "post_notification view_notification"
                                  : "post_notification"
                              }
                              onClick={() => handleRedirectToPost(data)}>
                              <div className='noti_box'>
                                <div className='noti_user_container'>
                                  <img
                                    src={data.pi || UserAvatar}
                                    className='noti_user_avatar'
                                  />
                                  {/* <AiFillHeart className='noti_heart' /> */}
                                </div>
                                <div className='noti_text'>
                                  <span className='noti_user_name'>
                                    {data.nm}{" "}
                                  </span>
                                  {data.cat === 1 ? (
                                    <span>is like your reply.</span>
                                  ) : (
                                    <span>is dislike your reply.</span>
                                  )}
                                  <br />
                                  <span className='noti_time'>
                                    {timeDifference(
                                      new Date(),
                                      new Date(data.ti)
                                    )}{" "}
                                    ago
                                  </span>
                                  <div
                                    className='noti_badge'
                                    data-label='Social'
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  notifications: state.notification.notifications,
});

export default connect(mapStateToProps, null)(NotificationComp);
