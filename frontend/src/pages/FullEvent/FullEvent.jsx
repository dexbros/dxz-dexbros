/** @format */

import React from "react";
import Layout from "../../layouts/main-layout.component";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { useParams, Link, useNavigate } from "react-router-dom";
import { setGroupData, setUpdateGroup } from "../../redux/Group/group.actions";
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
import { updateGroupPost } from "../../redux/Group/group.actions";
import { connect } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { GrMore } from "react-icons/gr";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CustomModal from "../../components/modal/CustomModal";
import MyModal from "../../components/modal/MyModal";

const FullEvent = ({
  eventData,
  user,
  token,
  selectGroup,
  setUpdateGroup,
  updatedGroup,
  join,
  updateGroupPost,
  removeToJoin,
  addToJoin,
}) => {
  const [event, setEvent] = React.useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [eventId, setEventId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startdate, setstartdate] = React.useState("");
  const [enddate, setenddate] = React.useState("");
  const [starttime, setstarttime] = React.useState("");
  const [endtime, setendtime] = React.useState("");
  const [link, setLink] = React.useState("");
  const [price, setPrice] = React.useState();
  const [image, setImage] = React.useState("");
  const [joinCount, setJoinCount] = React.useState(0);

  // *** Fetch event details
  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/event/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEvent(result);
        setJoinCount(result.j_u.length);
        // result.j_u.length;
      })
      .catch((error) => console.log("error", error));
  }, [id, updatedGroup, setUpdateGroup]);

  const handleDeleteEvent = (id) => {
    setOpenDeleteModal(true);
    setEventId(id);
  };

  // *** Delete event handler
  const deleteEvent = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/event/delete/${eventId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenDeleteModal(false);
        setEventId("");
        navigate(-1);
      })
      .catch((error) => console.log("error", error));
  };

  const handleChange = (e) => {
    setstartdate(e.target.value);
  };
  const handleEndDateChange = (e) => {
    setenddate(e.target.value);
  };

  const handleEditEventModal = (event) => {
    setOpenEditModal(true);
    setEventId(event.e_id);
    setTitle(event.tit);
    setDescription(event.des);
    setstartdate(event.s_d);
    setenddate(event.e_d);
    setstarttime(event.s_t);
    setendtime(event.e_t);
    setPrice(event.price);
  };

  const handleEditEvent = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      title: title,
      description: description,
      startdate: startdate,
      enddate: enddate,
      starttime: starttime,
      endtime: endtime,
      price: price,
    });

    console.log(raw);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/event/edit/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenEditModal(false);
        setTitle("");
        setDescription("");
        setstartdate("");
        setenddate("");
        setstarttime("");
        setendtime("");
        setPrice("");
        setUpdateGroup(result);
      })
      .catch((error) => console.log("error", error));
  };

  const onClose = () => {
    setOpenDeleteModal(false);
  };

  const joinEvent = () => {
    if (join.includes(id)) {
      removeToJoin(id);
      setJoinCount((prev) => prev - 1);
    } else {
      addToJoin(id);
      setJoinCount((prev) => prev + 1);
    }
    var axios = require("axios");

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/event/join/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        updateGroupPost(response);
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
        removeToJoin(id);
        setJoinCount((prev) => prev - 1);
      });
  };

  return (
    <Layout goBack={true} title={<HeaderTitle content={"Event"} />}>
      {openDeleteModal && (
        <CustomModal
          onClose={onClose}
          title='Delete event'
          body={<div>Do you want to delete this event?</div>}
          footer={
            <div>
              <button className='update_btn' onClick={deleteEvent}>
                Delete
              </button>
            </div>
          }
        />
      )}
      {/* Edit Modal */}

      {event && (
        <div className='full_event_container'>
          {/* Header Section */}
          <div className='event_header_container'>
            <div className='header_title'>
              <span>{event.tit}</span>
              <br />
              {event.price === "0" ? (
                <span className='event_price'>Free event</span>
              ) : (
                <span className='event_price'>Ticket price: {event.price}</span>
              )}
            </div>
            <div className='event_header_btn_container'>
              {event.e_c_dun !== user.handleUn ? (
                <button className='buy_ticket_btn'>Buy ticket</button>
              ) : null}
              <button className='buy_ticket_btn' onClick={() => joinEvent()}>
                {join.includes(user.handleUn) ? (
                  <>Joined {joinCount}</>
                ) : (
                  <>Join {joinCount}</>
                )}
              </button>
              {event.e_c_dun === user.handleUn && (
                <Menu
                  menuButton={
                    <MenuButton className='comment_header_dropdown'>
                      <GrMore className='comment_header_dropdown_icons' />
                    </MenuButton>
                  }>
                  {/* <MenuItem
                    className={"menu_item"}
                    onClick={() => handleEditEventModal(event)}>
                    Edit
                  </MenuItem> */}
                  <MenuItem
                    className={"menu_item"}
                    onClick={() => handleDeleteEvent(event.e_id)}>
                    Delete
                  </MenuItem>
                </Menu>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className='event_header_image_container'>
            {event.eventimage && (
              <img
                src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${event.eventimage}`}
                className='event_image'
              />
            )}
          </div>

          {/* Time and Location section */}
          <div className='time_location_section'>
            {/* Time */}
            <div className='event_time_container'>
              <div className='event_start_time'>
                <span>Start Time:</span>
                <span className='event_start_time_count'>
                  {" "}
                  {event.s_d.split(" ")[0]}, {event.s_d.split(" ")[2]}th,{" "}
                  {event.s_d.split(" ")[3]}
                </span>
              </div>

              {/* Event End time */}
              <div className='event_end_time'>
                <span>End Time:</span>
                <span className='event_start_time_count'>
                  {" "}
                  {event.e_d.split(" ")[0]}, {event.e_d.split(" ")[2]}th,{" "}
                  {event.e_d.split(" ")[3]}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className='location_section'>
              {event.link ? (
                <div className='event_type_section'>
                  <span className='event_type_text'>
                    Event mode: <span className='event_type'>{event.type}</span>
                  </span>
                  <br />
                  <Link className='join_link' to={""}>
                    Copy the joining link
                  </Link>
                </div>
              ) : (
                <div className='event_type_section'>Event mode: Online</div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className='detailts_container'>{event.des}</div>

          {/* Author detils */}
          <div className='event_user_container'>
            <div className='event_organizer_label'>Event origanizer</div>
            <img src={event.e_u_pImg} className='event_user_avatar' />
            <span className='event_user_name'>
              {event.e_u_fn} {event.e_u_ln}
            </span>
          </div>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  updatedGroup: state.group.updatedGroup,
  selectGroup: state.group.selectGroup,
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
  addToJoin: (data) => dispatch(addToJoin(data)),
  removeToJoin: (data) => dispatch(removeToJoin(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FullEvent);
