/** @format */

import React from "react";
import { connect } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CustomModal from "../../../../components/modal/CustomModal";
import { useParams } from "react-router-dom";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import axios from "axios";

const BlockPrivacy = ({ token, blockcast }) => {
  const { id } = useParams();
  const [join, setJoin] = React.useState(blockcast.chnl_prv || "all");
  const [feed, setFeed] = React.useState(blockcast.feed_view || "all");
  const [channel, setChannel] = React.useState(blockcast.chnl_view || "all");

  // *** Handle update join blockcast policy
  const handleJoinBlockcastPolicy = (value) => {
    const axios = require("axios");
    let data = JSON.stringify({
      join: value,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/update/feed/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setJoin(value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle update join blockcast policy
  const handleBlockcastFeedPrivacy = (value) => {
    const axios = require("axios");
    let data = JSON.stringify({
      feed: value,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/update/feed/view/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setFeed(value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // *** Handle update join blockcast policy
  const handleBlockcastChannelPrivacy = (value) => {
    const axios = require("axios");
    let data = JSON.stringify({
      channel: value,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/update/channel/view/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setChannel(value);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='block_cast_settings_page'>
      {/* Who can see your blockcast feed */}
      <li className='prvacy_settings_header'>Message privacy settings</li>
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            Who can join your blockcast channel
          </span>
          <br />
          <span className='privacy_box_description'>
            Only selected user can join your blockcast channel
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleJoinBlockcastPolicy("all")}>
            {join === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>All</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleJoinBlockcastPolicy("mem")}>
            {join === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>Members</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleJoinBlockcastPolicy("none")}>
            {join === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>None</span>
          </div>
        </div>
      </div>

      {/* Who can see your blockcast messages */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            Who can see your blockcast feed
          </span>
          <br />
          <span className='privacy_box_description'>
            Only selected user can see your blockcast feed
          </span>
        </div>

        {/* Feed privacy */}
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastFeedPrivacy("all")}>
            {feed === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>All</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastFeedPrivacy("mem")}>
            {feed === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>Members</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastFeedPrivacy("none")}>
            {feed === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>None</span>
          </div>
        </div>
      </div>

      {/* Who can see your blockcast messages */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            Who can send messages in channel
          </span>
          <br />
          <span className='privacy_box_description'>
            Only selected user can send messages in channel
          </span>
        </div>

        {/* Feed privacy */}
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastChannelPrivacy("all")}>
            {channel === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>All</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastChannelPrivacy("mem")}>
            {channel === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>Members</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleBlockcastChannelPrivacy("none")}>
            {channel === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>None</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  groupData: state.group.groupData,
  updatedGroup: state.group.updatedGroup,
  groupData: state.group.selectGroup,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockPrivacy);
