import React from 'react';
import {connect} from "react-redux"
import { Link } from 'react-router-dom';
import "./GroupEventComponent.css";
import timeDifference from "../../utils/getCreateTime";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreHorizontal } from "react-icons/fi";
import GroupEventTimer from "../Group.EventTimer/EventTimer";
import { useState, useEffect } from 'react';
import { getRemainingTimeUntilMsTimestamp } from "../../utils/CountDownTimerUtils";
import { addGroupPost, updateGroupPost, deleteGroupPost, addPostComment, updatePostComment, deletePostComment, setUpdateGroup } from "../../redux/Group/group.actions";
import { addGroupPost, updateGroupPost, deleteGroupPost, addPostComment, updatePostComment, deletePostComment, setUpdateGroup } from "../../redux/user/user.actions";

const GroupEventComponent = ({ event, updateGroupPost }) => {
  const start = getRemainingTimeUntilMsTimestamp(event.date);
  const end = getRemainingTimeUntilMsTimestamp(event.endDate);

  

  return (
    <div className='group_event_card'>
      {/* Event header */}
      <div className='group_event_card_header'>
        <div className='header_box1'>
          <img src={event.creator.profilePic} className="profile_image" />
          <Link to={`/profile/${event.creator._id}`} className="profile_name">
            {event.creator.displayFirstName ? event.creator.displayFirstName : event.creator.firstName} {" "} {event.creator.displayLastName ? event.creator.displayLastName : event.creator.lastName}
          </Link>

          <span className='profile_username'>@{event.creator.handleUn ? event.creator.handleUn : event.creator.username}</span>
          <span className='event_time'>{timeDifference(new Date(), new Date(event.createdAt))}</span>

          {/* Active */}
          

        </div>
        <Menu
          menuButton={
            <MenuButton>
              <FiMoreHorizontal />
            </MenuButton>
          }>
          <MenuItem className={"event_menu_item"}>Edit</MenuItem>
          <MenuItem className={"event_menu_item"}>Delete</MenuItem>
        </Menu>
      </div>


      {/* Event Body */}
      <div className='group_event_body'>
        {

        }
        <div className='event_title'>{ event.title}</div>
        <div className='event_description'>{event.description}</div>
        <div className='event_teme_left'>
          <span className='sub_header start'>Starting Time:</span> <GroupEventTimer countdownTimestampMs={event.date} />  
        </div>
        <div className='event_teme_left'>
          <span className='sub_header end'>End Time:</span> <GroupEventTimer countdownTimestampMs={event.endDate} />
        </div>
      </div>


    </div>
  )
};
const mapStateToProps = state => ({
  user: state.user.user,
  token: state.user.token,
  likeList: state.user.likes,
  spamList: state.user.spam,
  sharesList: state.user.shares,
  updatePost: state.group.updatePost,
  groupData: state.group.groupData,
  updatedGroup: state.group.updatedGroup,
});
  
const mapDispatchToProps = dispatch => ({
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(GroupEventComponent);