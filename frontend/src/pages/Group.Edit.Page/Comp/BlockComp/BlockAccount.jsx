/** @format */

import React from "react";
import { connect } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CustomModal from "../../../../components/modal/CustomModal";
import { useParams } from "react-router-dom";

const BlockAccount = ({ token, blockcast }) => {
  const { id } = useParams();
  const [name, setName] = React.useState(blockcast.name);
  const [openNameSettings, setOpenNameSettings] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [isNameEmpty, setIsNameEmpty] = React.useState(true);

  // Block bio
  const [bio, setBio] = React.useState(blockcast.des);
  const [openBioSettings, setOpenBioSettings] = React.useState(false);
  const [newBio, setNewBio] = React.useState("");
  const [isBioEmpty, setIsBioEmpty] = React.useState(true);

  const [openModal, setOpenModal] = React.useState(false);
  const [openModalBio, setOpenModalBio] = React.useState(false);

  // *** Update block name
  const handleChangeName = () => {
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
        setName(newName);
        setOpenNameSettings(false);
        setNewName("");
        setOpenModal(true);
      })
      .catch(function (error) {
        console.log(error);
        setOpenNameSettings(false);
        setNewName("");
      });
  };
  React.useEffect(() => {
    if (!newName.trim()) {
      setIsNameEmpty(true);
    } else {
      setIsNameEmpty(false);
    }
  }, [newName]);

  const onClose = () => {
    setOpenModal(false);
    setOpenModalBio(false);
  };

  // *** Handle update blockcast name
  const handleUpdateBlockcastName = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: newName,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/update/blockcast/name/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setOpenNameSettings(false);
        setName(newName);
        setNewName("");
        setOpenModal(true);
      })
      .catch(function (error) {
        console.log(error);
        setOpenNameSettings(false);
        setOpenModal(false);
        setNewName("");
      });
  };

  React.useEffect(() => {
    if (!newBio.trim()) {
      setIsBioEmpty(true);
    } else {
      setIsBioEmpty(false);
    }
  }, [newBio]);
  // *** Update block bio
  const handleChangeBio = () => {
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
        console.log(response);
        setOpenModalBio(false);
      })
      .catch(function (error) {
        console.log(error);
        setOpenModalBio(false);
      });
  };
  // *** Handle update blockcast bio
  const handleUpdateBlockcastBio = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      bio: newBio,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/update/blockcast/bio/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setBio(newBio);
        setBio("");
        setIsBioEmpty(true);
        setOpenBioSettings(false);
        setOpenModalBio(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className='block_cast_settings_page'>
      {openModal && (
        <CustomModal
          onClose={onClose}
          title={"Update blockcast name"}
          body={"Do you want to set same name for block and blockcast"}
          footer={
            <button className='modal_btn' onClick={handleChangeName}>
              Yes
            </button>
          }
        />
      )}

      {openModalBio && (
        <CustomModal
          onClose={onClose}
          title={"Update blockcast details"}
          body={"Do you want to set same bio for block and blockcast"}
          footer={
            <button className='modal_btn' onClick={handleChangeBio}>
              Yes
            </button>
          }
        />
      )}
      {/* settings name section */}
      <React.Fragment>
        <div className='settings_sub_header_section'>
          <span className='settings_sub_header_section_text'>Update name</span>
          <button
            className='settings_block_btn_icon'
            onClick={() => setOpenNameSettings((p) => !p)}>
            <BiEditAlt />
          </button>
        </div>
        {openNameSettings ? (
          <div className='settings_toggle_box'>
            <input
              type='text'
              className='settings_input'
              placeholder='Update block name'
              value={newName}
              onChange={(e) => setNewName(e.target.value.slice(0, 50))}
            />
            <div className='update_btn_section'>
              {isNameEmpty ? null : (
                <button
                  className='update_btn'
                  onClick={handleUpdateBlockcastName}>
                  Update
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='settings_toggle_box'>
            <span className='sub_title'>Name:</span>
            <span className='block_value'>{name}</span>
          </div>
        )}
      </React.Fragment>

      {/* settings bio section */}
      <React.Fragment>
        <div className='settings_sub_header_section'>
          <span className='settings_sub_header_section_text'>
            Update blockcast description
          </span>
          <button
            className='settings_block_btn_icon'
            onClick={() => setOpenBioSettings((p) => !p)}>
            <BiEditAlt />
          </button>
        </div>
        {openBioSettings ? (
          <div className='settings_toggle_box'>
            <textarea
              type='text'
              className='settings_textarea'
              placeholder='Update block name'
              value={newBio}
              onChange={(e) => setNewBio(e.target.value.slice(0, 100))}
            />
            <div className='update_btn_section'>
              {isBioEmpty ? null : (
                <button
                  className='update_btn'
                  onClick={handleUpdateBlockcastBio}>
                  Update
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='settings_toggle_box'>
            <span className='sub_title'>Description:</span>
            <span className='block_value'>{bio}</span>
          </div>
        )}
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlockAccount);
