/** @format */

import React, { useEffect, useState } from "react";
import Layout from "../../layouts/main-layout.component";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./GroupEdit.css";
import { setPageType } from "../../redux/page/page.actions";
import { setUpdateGroup } from "../../redux/Group/group.actions";
import CustomModal from "../../components/modal/CustomModal";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { ReactComponent as MoreIcon } from "../../Assets/Icons/more.svg";
import BlockEditSkeleton from "../../components/SkeletonLoading/BlockEditSkeleton";

import Account from "./Comp/Account";
import Privacy from "./Comp/Rpivacy";
const BLockSettings = ({
  token,
  user,
  setPageType,
  setUpdateGroup,
  updatedGroup,
  groupData,
}) => {
  const { id } = useParams();
  const [block, setBlock] = React.useState(null);
  const [openNameModal, setOpenNameModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // Bio
  const [openBioModal, setOpenBioModal] = React.useState(false);
  const [bio, setBio] = React.useState("");
  const [isDisable1, setIsDisable1] = React.useState(true);

  // Privacy
  const [privacy, setPrivacy] = React.useState(0);
  const [openPrivacyModal, setOpenPrivacyModal] = React.useState(false);

  // Member
  const [members, setMembers] = React.useState([]);
  const [adminsList, setAdminsList] = React.useState([]);
  const [openMemModal, setOpenMemModal] = React.useState(false);
  const [openAdminModal, setOpenAdminModal] = React.useState(false);
  const [hideList, setHideList] = React.useState([]);
  const [openHideModal, setOpenHideModal] = React.useState(false);

  // Privacy state
  const [postPrivacy, setPostPrivacy] = React.useState("all");
  const [blockPrivacy, setBlockPrivacy] = React.useState("all");
  const [msgPrivacy, setMsgPrivacy] = React.useState("all");

  const [activeState, setActiveState] = React.useState("acc");
  React.useLayoutEffect(() => {
    setPageType("block_page");
  }, []);

  // ** Fecth block details
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBlock(result);
        setName(result.g_n);
        setBio(result.g_bio);
        setPrivacy(result.g_privacy);
        setPostPrivacy(result.postPrivacy || "all");
        setBlockPrivacy(result.blockPrivacy || "all");
        setMsgPrivacy(result.msgPrivacy || "all");
      })
      .catch((error) => console.log("error", error));
  }, [updatedGroup]);

  React.useEffect(() => {
    if (!name.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name]);

  // *** Update block name
  const handleChangeName = () => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      name: name,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/update/name/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setUpdateGroup(response);
        setOpenNameModal(false);
        setIsDisable(true);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (!bio.trim()) {
      setIsDisable1(true);
    } else {
      setIsDisable1(false);
    }
  }, [bio]);

  // *** Update block bio
  const handleChangeBio = () => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      bio: bio,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/update/bio/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUpdateGroup(response.data);
        setOpenBioModal(false);
        setIsDisable1(true);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Update block privacy
  const handleChangePrivacy = () => {
    console.log(msgPrivacy);
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      postPrivacy: postPrivacy,
      blockPrivacy: blockPrivacy,
      msgPrivacy: msgPrivacy,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/update/privacy/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setUpdateGroup(response.data);
        setOpenPrivacyModal(false);
        // setIsDisable1(true);
        setPrivacy("");
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle fetch members
  const handleFetchMemebers = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: "Group updated",
    });

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/fetch/block/members/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setMembers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleOpenMemeberModal = () => {
    setOpenMemModal(true);
    handleFetchMemebers();
  };

  const onClose = () => {
    setOpenMemModal(false);
    setOpenAdminModal(false);
    setOpenHideModal(false);
  };

  // *** Add to ADMIN
  const handleAddAdmin = (username) => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/admin/members/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUpdateGroup(response.data);
        setOpenMemModal(false);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Fetch all admins
  const fetchAdmins = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: "Group updated",
    });

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/fetch/block/admins/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setAdminsList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleOpenAdminModal = () => {
    setOpenAdminModal(true);
    fetchAdmins();
  };

  // *** Handle remove admins
  const handleRemoveAdmin = (username) => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/admin/remove/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUpdateGroup(response.data);
        setOpenAdminModal(false);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Fetch all hide users
  const fetchHideMember = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: "Group updated",
    });

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/fetch/hide/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setHideList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Handle hide modal
  const handleHideModal = () => {
    setOpenHideModal(true);
    fetchHideMember();
  };

  // *** Add hide memeber
  const handleHideMemeber = (username) => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/add/hide/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUpdateGroup(response.data);
        setOpenMemModal(false);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Remove hide user or Unhide user
  const handleUnhideMemeber = (username) => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/hide/remove/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setUpdateGroup(response.data);
        setOpenHideModal(false);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {block ? (
        <div className='block_page_settings_container'>
          {/* Block navbar */}
          <div className='block_navbar_section'>
            <li
              className={
                activeState === "acc"
                  ? "block_settings_nav_btn active_block_settings_nav_btn"
                  : "block_settings_nav_btn"
              }
              onClick={() => setActiveState("acc")}>
              Account
            </li>
            <li
              className={
                activeState === "prv"
                  ? "block_settings_nav_btn active_block_settings_nav_btn"
                  : "block_settings_nav_btn"
              }
              onClick={() => setActiveState("prv")}>
              Privacy
            </li>
            <li
              className={
                activeState === "mem"
                  ? "block_settings_nav_btn active_block_settings_nav_btn"
                  : "block_settings_nav_btn"
              }
              onClick={() => setActiveState("mem")}>
              Members
            </li>
          </div>

          {/* Rendering block settings component */}
          <div className='block_settings_component'>
            {activeState == "acc" ? (
              <Account block={block} />
            ) : (
              <>
                {activeState === "prv" ? (
                  <Privacy block={block} />
                ) : (
                  <>Members</>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <BlockEditSkeleton />
      )}
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(BLockSettings);
