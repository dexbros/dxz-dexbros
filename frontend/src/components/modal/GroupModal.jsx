/** @format */

import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./Modal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostHideModal = ({ group, setOpenModal, token, user }) => {
  const { id } = useParams();
  const groupId = id;
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  const closeModal = () => {
    setOpenModal(false);
    setMembers([]);
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/?search=${search}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMembers(result);
      })
      .catch((error) => console.log("error", error));
  }, [search]);

  const addToGroup = (userId) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/add?userId=${userId}&groupId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setOpenModal(false);
        toast.error(result.msg);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className='__modal_overlay'>
      <div className='__modal new_modal'>
        <div className='__modal_header'>
          <span className='modal_header_text'>Add Group members</span>
          <button className='_modal_delete_close_btn'>
            <AiOutlineClose className='_modal_close_btn' onClick={closeModal} />
          </button>
        </div>
        {/* Modal Body */}
        <div className='__group_modal_body'>
          <input
            type='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='modal_input'
          />
          <ToastContainer />
        </div>

        {/* MODAL FOOTER */}
        <div className='__group_footer'>
          {(members || []).length > 0 ? (
            <>
              {members.map((member) => (
                <div className='user_modal_card' key={member._id}>
                  <Link to={`/profile/${member._id}`}>
                    <img src={member.profilePic} className='user_avatar' />
                  </Link>

                  {/* Name */}
                  <Link to={`/profile/${member._id}`} className='name'>
                    {member.displayFirstName
                      ? member.displayFirstName
                      : member.firstName}{" "}
                    {member.displayLastName
                      ? member.displayLastName
                      : member.lastName}
                  </Link>

                  {/* Creator */}
                  {member.grp_own.includes(id) && (
                    <span className='creator_tag'>Creator</span>
                  )}

                  {/* Creator */}
                  {member.grp_mem.includes(id) && (
                    <span className='members_tag'>Member</span>
                  )}

                  {member.grp_mem.includes(id) ||
                  member.grp_own.includes(id) ? null : (
                    <button
                      className='add_btn'
                      onClick={() => addToGroup(member._id)}>
                      Add
                    </button>
                  )}
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostHideModal);
