/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { SiGoogleanalytics } from "react-icons/si";
import "./Member.css";
import MyModal from "../../components/modal/MyModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { GrMore } from "react-icons/gr";

const Members = ({ member, group, token, user }) => {
  const { id } = useParams();
  const [openModModal, setOpenModModal] = useState(false);
  const [openModal, setOpenModal] = useState(false); // This modal state for remove moderator modal...
  const [userDisplayName, setUserDisplayName] = useState("");
  const [hideModal, setHideModal] = useState(false);

  const [openHideModal, setOpenHideModal] = React.useState(false);
  const [openHandleRemoveModal, setOpenRemoveModal] = useState(false);

  const handleModModal = (value) => {
    setOpenModModal(true);
    setUserDisplayName(value);
  };
  // *** Handle group admin
  const addToMod = (userDisplayName) => {
    var axios = require("axios");
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/add-admin?handleUn=${userDisplayName}&groupId=${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setOpenModModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Handle group member hide modal
  const handleHideModal = (value) => {
    setOpenHideModal(true);
    setUserDisplayName(value);
  };
  const hideFromGroup = () => {
    var axios = require("axios");
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/add-hide?handleUn=${userDisplayName}&groupId=${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setOpenModModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Handle group remove modal
  const handleRemoveModal = (value) => {
    setOpenRemoveModal(true);
    setUserDisplayName(value);
  };
  const handleRemoveUser = () => {
    var axios = require("axios");
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/group/remove?handleUn=${userDisplayName}&groupId=${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setOpenRemoveModal(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <>
        {/* Hide Modal */}
        {openHideModal && (
          <MyModal
            title='Hide'
            body='Do you want to hide this user'
            clickHandler={hideFromGroup}
            setIsClose={setOpenHideModal}
            btnText='Hide'
            postId={userDisplayName}
          />
        )}

        {/* Group admin modal */}
        {openModModal && (
          <MyModal
            title={"Add to Admin"}
            body='Do you want to add this user as admin of your group?'
            clickHandler={addToMod}
            setIsClose={setOpenModModal}
            btnText='Save'
            postId={userDisplayName}
          />
        )}

        {/* Remove user modal */}
        {openHandleRemoveModal && (
          <MyModal
            title={"Remove from group"}
            body='Do you want to remove from group?'
            clickHandler={handleRemoveUser}
            setIsClose={setOpenRemoveModal}
            btnText='Remove'
            postId={userDisplayName}
          />
        )}
        {hideModal && (
          <MyModal
            title={"Hide User"}
            body='Do you want to hide this user from your group?'
            clickHandler={hideFromGroup}
            setIsClose={setHideModal}
            btnText='Hide'
            postId={userDisplayName}
          />
        )}
        <div className={"user_card"}>
          <div className='card_user_info'>
            <Link to={`/profile/${member.d_u}`}>
              <img
                src={member.p_i ? member.p_i : ""}
                className='user_card_avatar'
              />
            </Link>
            {/* NAME */}
            <Link to={`/profile/${member.d_u}`} className='user_cardname'>
              {member.f_n} {member.l_n}
            </Link>
            <span className='user_card_username'>@{member.d_u}</span>
            {group.admins.includes(member.d_u) && (
              <span className='addmin_tag'>Admin</span>
            )}

            {group.hide.includes(member.d_u) && (
              <span className='addmin_tag'>Hide</span>
            )}
            <ToastContainer />
          </div>

          {user.handleUn !== member.d_u && (
            <>
              {group.g_c_dun === user.handleUn && (
                <Menu
                  menuButton={
                    <MenuButton>
                      <GrMore />
                    </MenuButton>
                  }>
                  <MenuItem
                    className={"menu_item"}
                    onClick={() => handleModModal(member.d_u)}>
                    {group.admins.includes(member.d_u) ? (
                      <>Remove</>
                    ) : (
                      <>Admin</>
                    )}
                  </MenuItem>

                  <MenuItem
                    className={"menu_item"}
                    onClick={() => handleHideModal(member.d_u)}>
                    Hide
                  </MenuItem>

                  {group.g_mem.length > 3 && (
                    <MenuItem
                      className={"menu_item"}
                      onClick={() => handleRemoveModal(member.d_u)}>
                      Remove from group
                    </MenuItem>
                  )}
                  <MenuItem
                    className={"menu_item"}
                    onClick={() => handleHideModal(member.d_u)}>
                    Block user
                  </MenuItem>
                </Menu>
              )}
            </>
          )}
        </div>
      </>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
