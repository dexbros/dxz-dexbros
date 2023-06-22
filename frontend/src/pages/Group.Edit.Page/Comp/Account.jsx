/** @format */

import React from "react";
import { BiEditAlt } from "react-icons/bi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import CustomModal from "../../../components/modal/CustomModal";
import CustomPostFormModal from "../../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
import UserAvatar from "../../../Assets/userAvatar.webp";
import { RiUserStarFill, RiUserSettingsLine } from "react-icons/ri";

// TOOLKIT
import { useDispatch, useSelector } from "react-redux";
import {
  handleUpdateBlockName,
  handleUpdateBlockBio,
  handleFetchBlockMembers,
  handleAddBlockAdmin,
} from "../../../redux/_block/blockSlice";
import { selectToken } from "../../../redux/_user/userSelectors";
import { useTranslation } from "react-i18next";

const Account = ({ block }) => {
  const { t } = useTranslation(["common"]);
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  
  const [id, setId] = React.useState(block.g_id);
  // Block name
  const [name, setName] = React.useState(block.g_n);
  const [openNameSettings, setOpenNameSettings] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [isNameEmpty, setIsNameEmpty] = React.useState(true);

  // Block bio
  const [bio, setBio] = React.useState(block.g_bio);
  const [openBioSettings, setOpenBioSettings] = React.useState(false);
  const [newBio, setNewBio] = React.useState("");
  const [isBioEmpty, setIsBioEmpty] = React.useState(true);

  // Block type
  const [type, setType] = React.useState(block.g_type);
  const [lists, setLists] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Blockcast
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalBio, setOpenModalBio] = React.useState(false);

  const [openMemberModal, setOpenMemebrModal] = React.useState(false);
  const [members, setMembers] = React.useState([]);
  const [admins, setAdmins] = React.useState(block.admins);

  // *** Update block name
  const handleChangeName = async () => {
    const data = { token, id, name: newName };
    const result = await dispatch(handleUpdateBlockName(data));
    console.log(result);
    setName(newName);
    setOpenNameSettings(false);
    setNewName("");
    setOpenModal(true);
  };
  React.useEffect(() => {
    if (!newName.trim()) {
      setIsNameEmpty(true);
    } else {
      setIsNameEmpty(false);
    }
  }, [newName]);

  React.useEffect(() => {
    if (!newBio.trim()) {
      setIsBioEmpty(true);
    } else {
      setIsBioEmpty(false);
    }
  }, [newBio]);
  // *** Update block bio
  const handleChangeBio = async () => {
    const data = { token, id, bio: newBio };
    const result = await dispatch(handleUpdateBlockBio(data));
    console.log(result);
    setBio(newBio);
    setNewBio("");
    setIsBioEmpty(true);
    setOpenBioSettings(false);
    setOpenModalBio(true);
  };

  // *** Fetch all crypto currency
  const fetchCryptoCurrency = () => {
    setIsLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/fetch/crypto`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setLists(result);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };
  React.useEffect(() => {
    fetchCryptoCurrency();
  }, []);

  const onClose = () => {
    setOpenModal(false);
    setOpenModalBio(false);
    setOpenMemebrModal(false);
  };

  /**
   * @THIS_API_SHOULD_CONVERT_INTO_TOOLKIT
   */
  // *** Handle update blockcast name
  const handleUpdateBlockcastName = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      name: name,
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
        setOpenModal(false);
        // setName(newName);
        // setOpenNameSettings(false);
        // setNewName("");
      })
      .catch(function (error) {
        console.log(error);
        // setOpenNameSettings(false);
        // setNewName("");
      });
  };

  /**
   * @THIS_API_SHOULD_CONVERT_INTO_TOOLKIT
   */
  // *** Handle update blockcast bio
  const handleUpdateBlockcastBio = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      bio: bio,
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
        setOpenModalBio(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleOpenMemberModal = () => {
    setOpenMemebrModal(true);
    handleFetchMemebers();
  };

  // *** Handle fetch members
  const handleFetchMemebers = async () => {
    const data = { token, id };
    const response = await dispatch(handleFetchBlockMembers(data));
    setMembers(response);
  };

  // Add user to admin list
  const handleAddAdmin = (username) => {
    if (admins.includes(username)) {
      console.log("Admin");
      const temp = admins;
      const arr = temp.filter((data) => data !== username);
      setAdmins(arr);
    } else {
      console.log("Not Admin");
      setAdmins((prev) => [...prev, username]);
    }
    const data = { token, id, username };
    dispatch(handleAddBlockAdmin(data));
    // var axios = require("axios");
    // var data = JSON.stringify({
    //   username: username,
    // });
    // var config = {
    //   method: "put",
    //   url: `${process.env.REACT_APP_URL_LINK}api/group/admin/members/${id}`,
    //   headers: {
    //     Authorization: "Bearer " + token,
    //     "Content-Type": "application/json",
    //   },
    //   data: data,
    // };
    // axios(config)
    //   .then(function (response) {
    //     console.log(response.data);
    //     // setMembers(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <div className='account_settings_page'>
      {openModal && (
        <CustomModal
          onClose={onClose}
          title={t("Update blockcast name")}
          body={t("Do you want to set same name for block and blockcast")}
          footer={
            <button className='modal_btn' onClick={handleUpdateBlockcastName}>
              {t("Yes")}
            </button>
          }
        />
      )}

      {openModalBio && (
        <CustomModal
          onClose={onClose}
          title={t("Update blockcast details")}
          body={t("Do you want to set same bio for block and blockcast")}
          footer={
            <button className='modal_btn' onClick={handleUpdateBlockcastBio}>
              {t("Yes")}
            </button>
          }
        />
      )}

      {openMemberModal && (
        <CustomPostFormModal
          onClose={onClose}
          title={
            <div className='comment_modal_title_section'>
              <div className='modal_comment_box'>
                <button className='modal_header_btn' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='modal_header_title'>{t("Members")}</span>
              </div>
            </div>
          }
          body={
            <div className='user_card_container'>
              {members.map((profile, index) => (
                <div className='modal_user_card' key={index}>
                  <div
                    className='block_member_info_section'
                    onClick={() =>
                      redirectToProfile(profile.record.bins.handleUn)
                    }>
                    <img
                      src={profile.record.bins.profilePic || UserAvatar}
                      className='modal_user_card_image'
                      alt=''
                      srcSet=''
                    />
                    <span className='block_user_card_name'>
                      {profile.record.bins.fn} {profile.record.bins.ln}
                    </span>
                    <span className='block_author_tag'>
                      {profile.record.bins.handleUn === block.g_c_dun && (
                        <RiUserStarFill className='admin_icon' />
                      )}
                    </span>
                    <span className='admin'>
                      {admins.includes(profile.record.bins.handleUn) && (
                        <RiUserSettingsLine className='admin_icon' />
                      )}
                    </span>
                  </div>

                  <>
                    {profile.record.bins.handleUn !== block.g_c_dun && (
                      <button
                        className='mod_button'
                        onClick={() =>
                          handleAddAdmin(profile.record.bins.handleUn)
                        }>
                        <RiUserSettingsLine />
                      </button>
                    )}
                  </>
                </div>
              ))}
            </div>
          }
        />
      )}

      <span className='block_header_text'>{t("Account Settings")}</span>
      <div className='block_name_settings'>
        {/* settings name section */}
        <React.Fragment>
          <div className='settings_sub_header_section'>
            <span className='settings_sub_header_section_text'>
              {t("Update name")}
            </span>
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
                  <button className='update_btn' onClick={handleChangeName}>
                    {t("Update")}
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
              {t("Update group description")}
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
                  <button className='update_btn' onClick={handleChangeBio}>
                    {t("Update")}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className='settings_toggle_box'>
              <span className='sub_title'>{t("Description")}:</span>
              <span className='block_value'>{bio}</span>
            </div>
          )}
        </React.Fragment>

        {/* Setting block type */}
        {/* settings bio section */}
        <React.Fragment>
          <div className='settings_sub_header_section'>
            <span className='settings_sub_header_section_text'>
              {t("Update group members")}
            </span>
            <button
              className='settings_block_btn_icon'
              onClick={handleOpenMemberModal}>
              <BiEditAlt />
            </button>
          </div>
        </React.Fragment>
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

export default Account;
