/** @format */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MyModal from "../modal/MyModal";
import {
  setGroupData,
  setUpdateGroup,
  updateGroupPost,
} from "../../redux/Group/group.actions";
import { setPageType } from "../../redux/page/page.actions";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
} from "../../redux/post/post.actions";
import {
  addToInterest,
  removeToInterest,
  addToNotInterest,
  removeToNotnterest,
  addToJoin,
  removeToJoin,
} from "../../redux/user/user.actions";
import { connect } from "react-redux";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EventComp = ({
  eventData,
  user,
  token,
  selectGroup,
  updateGroupPost,
  addToInterest,
  removeToInterest,
  addToNotInterest,
  removeToNotnterest,
  addToJoin,
  removeToJoin,
  join,
  interests,
  notInterests,
}) => {
  // console.log(eventData)
  const navigate = useNavigate();
  const [start, setStart] = React.useState("");
  const [openModal, setOpenModal] = React.useState(false);
  const [event, setEvent] = React.useState(null);
  const [intersetCount, setInterestCount] = React.useState(
    eventData.i_u.length
  );
  const [notInterestCount, setNotInterestCount] = React.useState(
    eventData.n_i_u.length
  );
  const [joinCount, setJoinCount] = React.useState(eventData.j_u.length);

  function timeDifference(endDate, currentDate) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = endDate - currentDate;
    console.log(elapsed);

    if (elapsed < msPerMinute) {
      if (elapsed / 1000 < 30) return "Just now";
      return ` ${Math.round(elapsed / 1000)} seconds`;
    } else if (elapsed < msPerHour) {
      return ` ${Math.round(elapsed / msPerMinute)} minutes`;
    } else if (elapsed < msPerDay) {
      return ` ${Math.round(elapsed / msPerHour)} hours`;
    } else if (elapsed < msPerMonth) {
      return ` ${Math.round(elapsed / msPerDay)} days`;
    } else if (elapsed < msPerYear) {
      return ` ${Math.round(elapsed / msPerMonth)} months`;
    } else {
      return ` ${Math.round(elapsed / msPerYear)} years`;
    }
  }

  const handleClickEvent = (e, value, id) => {
    console.log(value);
    e.stopPropagation();
    if (value === "interest") {
      handleInterest(id);
    } else if (value === "not_interest") {
      handleNotInterest(id);
    } else if (value === "join") {
      handleJoin(id);
    } else {
      console.log(value);
      navigate(`/event/${id}`);
    }
  };

  // *** Interested event
  const handleInterest = (id) => {
    if (join.includes(id)) {
      removeToJoin(id);
      setJoinCount((prev) => prev - 1);
      addToInterest(id);
      setInterestCount((prev) => prev + 1);
    } else if (notInterests.includes(id)) {
      removeToNotnterest(id);
      setNotInterestCount((prev) => prev - 1);
      addToInterest(id);
      setInterestCount((prev) => prev + 1);
    } else {
      if (interests.includes(id)) {
        removeToInterest(id);
        setInterestCount((prev) => prev - 1);
      } else {
        addToInterest(id);
        setInterestCount((prev) => prev + 1);
      }
    }
    const axios = require("axios");
    let data = JSON.stringify({
      list: JSON.stringify(eventData.i_u),
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/event/interest/${id}?value=interest`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        updateGroupPost(response);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        removeToInterest(id);
        console.log(error);
      });
  };

  // *** Not interested event
  const handleNotInterest = (id) => {
    if (interests.includes(id)) {
      removeToInterest(id);
      setInterestCount((prev) => prev - 1);
      addToNotInterest(id);
      setNotInterestCount((prev) => prev + 1);
    } else if (join.includes(id)) {
      removeToJoin(id);
      setJoinCount((prev) => prev - 1);
      addToNotInterest(id);
      setNotInterestCount((prev) => prev + 1);
    } else {
      if (notInterests.includes(id)) {
        removeToNotnterest(id);
        setNotInterestCount((prev) => prev - 1);
      } else {
        addToNotInterest(id);
        setNotInterestCount((prev) => prev + 1);
      }
    }
    const axios = require("axios");
    let data = JSON.stringify({
      list: JSON.stringify(eventData.n_i_u),
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/event/not_interest/${id}?value=interest`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        updateGroupPost(response);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        removeToNotnterest(id);
        setNotInterestCount((prev) => prev - 1);
      });
  };

  // *** Handle join Event
  const handleJoin = (id) => {
    if (interests.includes(id)) {
      removeToInterest(id);
      setInterestCount((prev) => prev - 1);
      addToJoin(id);
      setJoinCount((prev) => prev + 1);
    } else if (notInterests.includes(id)) {
      removeToNotnterest(id);
      setNotInterestCount((prev) => prev - 1);
      addToJoin(id);
      setJoinCount((prev) => prev + 1);
    } else {
      if (join.includes(id)) {
        removeToJoin(id);
        setJoinCount((prev) => prev - 1);
      } else {
        addToJoin(id);
        setJoinCount((prev) => prev + 1);
      }
    }
    const axios = require("axios");
    let data = JSON.stringify({
      list: JSON.stringify(eventData.n_i_u),
    });

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/event/join/${id}?value=interest`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        updateGroupPost(response);
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        removeToJoin(id);
        setJoinCount((prev) => prev - 1);
      });
  };

  return (
    <React.Fragment>
      {!eventData.delete && (
        <div
          className={
            eventData.active ? "event_card" : "event_card deactive_card"
          }
          id='card'
          onClick={(e) => handleClickEvent(e, e.target.id, eventData.e_id)}>
          <p className='event_title'>{eventData.tit}</p>
          <span className='ebvent_remaing_days'>
            Remaining days:{" "}
            {timeDifference(
              new Date(eventData.e_d).getTime(),
              new Date().getTime()
            )}
          </span>
          <p className='event_description'>
            {eventData.des.length > 100 ? (
              <>{eventData.des.slice(0, 100)}...</>
            ) : (
              <>{eventData.des}</>
            )}
          </p>
          {eventData.eventimage && (
            <img
              src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${eventData.eventimage}`}
              className='event_image'
            />
          )}
          {/* <>{event.eventimage}</> */}
          <div className='event_other_section'>
            {/* <span className='start_date'>Start date: <span className='event_count'>{start_day}, {start_date}th {start_month}, {start_year}</span> </span><br />
            <span className='start_date'>End date: <span className='event_count'>{end_day}, {end_date}th {end_month}, {end_year}</span></span> <br /> */}
            <span className='start_date'>
              Ticket Price:{" "}
              <span className='event_count'>{eventData.price}</span>{" "}
            </span>
          </div>

          {/* Footer */}
          <div className='event_footer_section'>
            {/* Interest */}
            <button className='event_btn one' id='interest'>
              Interest{" "}
              <span className='event_interest_count' id='interest'>
                {intersetCount || "0"}
              </span>
            </button>

            {/* Not intersted */}
            <button className='event_btn two' id='not_interest'>
              Not Interest{" "}
              <span className='event_notinterest_count' id='not_interest'>
                {notInterestCount || "0"}
              </span>
            </button>

            {/* Join button */}
            <button className='event_btn three' id='join'>
              Will Join{" "}
              <span className='event_join_count' id='join'>
                {joinCount || "0"}
              </span>
            </button>

            {/* <button className='event_btn one' id='interest'>
              Interest{" "}
              <span className='event_interest_count' id='interest'>
                {intersetCount || "0"}
              </span>
            </button>
            <button className='event_btn two' id='not_interest'>
              Not Interest{" "}
              <span className='event_notinterest_count' id='not_interest'>
                {notInterestCount || "0"}
              </span>
            </button> */}
            {/* <button className='event_btn three' id='join'>
              Will Join{" "}
              <span className='event_join_count' id='join'>
                {joinCount || "0"}
              </span>
            </button> */}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  updatedGroup: state.group.updatedGroup,
  selectGroup: state.group.selectGroup,
  updatePost: state.group.updatePost,
  interests: state.user.interestEvent,
  notInterests: state.user.notInterestEvent,
  join: state.user.join,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setGroupData: (data) => dispatch(setGroupData(data)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
  addToInterest: (data) => dispatch(addToInterest(data)),
  removeToInterest: (data) => dispatch(removeToInterest(data)),
  addToNotInterest: (data) => dispatch(addToNotInterest(data)),
  removeToNotnterest: (data) => dispatch(removeToNotnterest(data)),
  addToJoin: (data) => dispatch(addToJoin(data)),
  removeToJoin: (data) => dispatch(removeToJoin(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventComp);
