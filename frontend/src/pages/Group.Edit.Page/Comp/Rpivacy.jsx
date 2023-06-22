/** @format */

import React from "react";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import axios from "axios";

// Toolkit
import { useDispatch, useSelector } from "react-redux";
import {
  handleUpdateBlockJoinPrivacy,
  handleUpdateBlockPrivacy,
  handleUpdateBlockMembersPrivacy,
  handleUpdateBlockPostPrivacy,
  handleUpdateBlockEventPrivacy,
  handleUpdateDmBlockPrivacy,
} from "../../../redux/_block/blockSlice";
import { selectToken } from "../../../redux/_user/userSelectors";
import { useTranslation } from "react-i18next";

const Privacy = ({ block }) => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Who can join state
  const [join, setJoin] = React.useState(block.join_prv || "");
  // Who can post on group state
  const [post, setpost] = React.useState(block.post_prv || "");
  // Who can create an event state
  const [event, setEvent] = React.useState(block.eve_prv || "");
  // Who can join an event state
  const [joinEvent, setJoinEvent] = React.useState(block.jeve_prv || "");
  // Who can can see group details state
  const [view, setView] = React.useState(block.view || "");
  // Who can see group members state
  const [l_view, setl_View] = React.useState(block.l_view || "");
  // Who can send you DM's state
  const [dm_prv, setDm_prev] = React.useState(block.dm_prv || "");

  // *** handle update join update
  const handleUpdateJoin = async (value, id) => {
    const data = { token, id, join_prv: value };
    const response = await dispatch(handleUpdateBlockJoinPrivacy(data));
    console.log(response);
    setJoin(value);
  };

  // *** handle update block post privacy
  const handleUpdatePost = async (value, id) => {
    const data = { id, token, post_prv: value };
    const result = await dispatch(handleUpdateBlockPostPrivacy(data));
    console.log(result);
    setpost(value);
  };

  // *** handle update create event privacy
  const handleUpdateEventCreate = async (value, id) => {
    const data = { event: value, token, id };
    const response = await dispatch(handleUpdateBlockEventPrivacy(data));
    console.log(response);
    setEvent(value);
  };

  // *** handle update DM's privacy
  const handleUpdateDmPrivacy = async (value, id) => {
    const data = { token, id, dm_prv: value };
    const result = await dispatch(handleUpdateDmBlockPrivacy(data));
    console.log(result);
    setDm_prev(value);
    // alert("handleUpdatePost");
    // const axios = require("axios");
    // let data = JSON.stringify({
    //   dm_prv: value,
    // });

    // let config = {
    //   method: "put",
    //   maxBodyLength: Infinity,
    //   url: `${process.env.REACT_APP_URL_LINK}api/group/update/dm/privacy/${id}`,
    //   headers: {
    //     Authorization: "Bearer " + token,
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     console.log(response);
    //     setDm_prev(value);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  // *** handle update block details privacy
  const handleUpdateBlockDetailsPrivacy = async (value, id) => {
    const data = { token, id, view: value };
    const result = await dispatch(handleUpdateBlockPrivacy(data));
    console.log(result);
    setView(value);
  };

  // *** handle update block members lists privacy
  const handleUpdateBlockMembersListPrivacy = async (value, id) => {
    const data = { token, id, l_view: value };
    const response = await dispatch(handleUpdateBlockMembersPrivacy(data));
    console.log(response);
    setl_View(value);
  };

  return (
    <div className='account_settings_page'>
      {/* Account settings */}
      <li className='prvacy_settings_header'>
        {t("Account privacy settings")}
      </li>
      {/* 1. Who can join */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can join your block")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("If this a public block anyone can join block")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateJoin("all", block.g_id)}>
            {join === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>
          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateJoin("none", block.g_id)}>
            {join === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("None")}</span>
          </div>
        </div>
      </div>

      {/* 5. Who can can see group details */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can view block details")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("Only selected users can see your block details")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateBlockDetailsPrivacy("all", block.g_id)}>
            {view === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateBlockDetailsPrivacy("mem", block.g_id)}>
            {view === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateBlockDetailsPrivacy("none", block.g_id)}>
            {view === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("None")}</span>
          </div>
        </div>
      </div>

      {/* 6. Who can see group members */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can view block members details")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("Only selected users can see block members details")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() =>
              handleUpdateBlockMembersListPrivacy("all", block.g_id)
            }>
            {l_view === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() =>
              handleUpdateBlockMembersListPrivacy("mem", block.g_id)
            }>
            {l_view === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() =>
              handleUpdateBlockMembersListPrivacy("none", block.g_id)
            }>
            {l_view === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("None")}</span>
          </div>
        </div>
      </div>

      {/* ********** */}
      {/* Post privacy settings */}
      <li className='prvacy_settings_header'>{t("Post settings")}</li>
      {/* 2. Who can post on group */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can post on your block")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("Only selected users can post on your block")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdatePost("all", block.g_id)}>
            {post === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdatePost("mem", block.g_id)}>
            {post === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdatePost("none", block.g_id)}>
            {post === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>None</span>
          </div>
        </div>
      </div>

      {/* Event privacy settings */}
      <li className='prvacy_settings_header'>{t("Event settings")}</li>
      {/* 3. Who can create an event */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can create an event")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("Only selected users can create an event")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateEventCreate("mem", block.g_id)}>
            {event === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateEventCreate("none", block.g_id)}>
            {event === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("None")}</span>
          </div>
        </div>
      </div>

      {/* 4. Who can join an event */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can join an event")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t(
              "Only selected users can join an event others can see it but cannot join"
            )}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => setJoinEvent("mem")}>
            {joinEvent === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => setJoinEvent("none")}>
            {joinEvent === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>
        </div>
      </div>

      {/* Post privacy settings */}
      <li className='prvacy_settings_header'>{t("Message settings")}</li>
      {/* 2. Who can post on group */}
      <div className='privacy_box'>
        <div className='privacy_header_box'>
          <span className='privacy_box_title'>
            {t("Who can send you DM's")}
          </span>
          <br />
          <span className='privacy_box_description'>
            {t("Only selected users can send you DM's")}
          </span>
        </div>
        <div className='settings_radio_section'>
          {/* radio buttoon one */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateDmPrivacy("all", block.g_id)}>
            {dm_prv === "all" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("All")}</span>
          </div>

          {/* radio button two */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateDmPrivacy("mem", block.g_id)}>
            {dm_prv === "mem" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("Members")}</span>
          </div>

          {/* radio button three */}
          <div
            className='settings_radio_btn'
            onClick={() => handleUpdateDmPrivacy("none", block.g_id)}>
            {dm_prv === "none" ? (
              <BiRadioCircleMarked className='radio_btn_icon active_radio_btn' />
            ) : (
              <BiRadioCircle className='radio_btn_icon' />
            )}
            <span className='radio_btn_text'>{t("None")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
