import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from "react-icons/fi";
import { connect } from 'react-redux';
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { MdOutlineReportProblem } from "react-icons/md";
import {BsPin, BsFillPinFill} from "react-icons/bs"
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { BiHide } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import { BsTrash } from "react-icons/bs";
import MyModal from "../modal/MyModal";
import { newPosts, updatePost } from "../../redux/post/post.actions";
import { setPageType } from "../../redux/page/page.actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReportModal from "../modal/ReportModal";


const GroupCard = ({ groupData, user, token }) => {
  const [pinnedModal, setPinnedModal] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [hideModal, setHideModal] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reports, setReports] = useState([]);
  
  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}report`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setReports(result)
      })
      .catch(error => console.log('error', error));
  }, []);

  const reportModalHandler = (id) => {
    setOpenReportModal(true);
    setGroupId(id)
  }

  const handlePinnedModal = (id) => {
    setPinnedModal(true);
    setGroupId(id)
  }
  // GROUP PINNED OR UNPINNED HANDLER
  const pinnedGroup = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/pinned/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPinnedModal(false);
        setGroupId("");
        toast.error(result.msg)
        setPinnedModal(false);
      })
      .catch(error => console.log('error', error));
  };

  const hideModalHandler = (id) => {
    setHideModal(true);
    setGroupId(id);
  }
  // GROUP HIDE HANDLER
  const hideGroupHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/hide/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setGroupId("");
        setHideModal(false);
        console.log(result);
        toast.error(result.msg)
      })
      .catch(error => console.log('error', error));
  }

  const leaveModalHandler = (id) => {
    setLeaveModal(true);
    setGroupId(id);
  }
  // GROUP LEAVE HANDLER 
  const groupLeaveHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/unfollow/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setGroupId("");
        setLeaveModal(false)
      })
      .catch(error => console.log('error', error));
  };

  const deleteModalHandler = (id) => {
    setGroupId(id);
    setDeleteModal(true)
  }

  const groupDeleteHandler = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/delete/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  };

  const reportPostHandler = (id, list) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "list": list
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/report/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setOpenReportModal(false);
        toast(result.msg)
      })
      .catch(error => console.log('error', error));
  };

  return (
    <>
       {/* REPORT MODAL */}
      {
        openReportModal &&
        <ReportModal
          title="Report"
          postId={groupId}
          setIsClose={setOpenReportModal}
          data={reports[0].message}
          clickHandler={reportPostHandler}
        />
      }
      {/* PINNED MODAL */}
      {
        pinnedModal &&
        <MyModal
          title={groupData.pinned.includes(user._id) ? "Uninned" : "Pinned"}
          body={groupData.pinned.includes(user._id) ? "Do you want to unpinned this group ?" : "Do you want to pinned this group ?"}
          setIsClose={setPinnedModal}
          btnText={groupData.pinned.includes(user._id) ? "Unpinned" : "Pinned"}
          postId={groupId}
          clickHandler={pinnedGroup}
        />
      }

      {/* HIDE MODAL */}
      {
        hideModal &&
        <MyModal
          title="Hide"
          body="Do you want to hide this group ?"
          setIsClose={setHideModal}
          btnText="Hide"
          postId={groupId}
          clickHandler={hideGroupHandler}
        />
      }

      {/* LEAVE MODAL */}
      {
        leaveModal &&
        <MyModal
          title={"Leave Group"}
          body="Do you want to leave this group ?"
          setIsClose={setLeaveModal}
          btnText="Leave"
          postId={groupId}
          clickHandler={groupLeaveHandler}
        />
      }

      {/* DELETE MODAL */}
      {
        deleteModal &&
        <MyModal
          title={"Delete Group"}
          body="Do you want to delete this group ?"
          setIsClose={setDeleteModal}
          btnText="Delete"
          postId={groupId}
          clickHandler={groupDeleteHandler}
        />
      }

      {
        groupData &&
        <>
          {
            groupData.hide.includes(user._id) ?
              <div className='hide_msg'>
                You hide <span className='hide_page_name'>{groupData.group_name}</span> group.
                <button className='undo_btn' onClick={() => hideGroupHandler(groupData._id)}>Undo</button>
              </div> :
              <div className='group_card_container'>
                <div className='group_card'>
                  {
                    groupData.pinned.includes(user._id) &&
                    <span className='pinned_group'>
                      <BsFillPinFill />
                    </span>
                  }
                  <Link to={`/group/${groupData._id}`} className="group_img_container_avatar">
                    <img src={groupData.profile_img ? groupData.profile_img : ''} className="group_cover_image_avatar" />
                  </Link>
                  <Link to={`/group/${groupData._id}`} className="group_name">{groupData.group_name}</Link>
                  <span className='text'>Members: {groupData.members.length}</span>
                </div>
                <Menu
                  menuButton={
                    <MenuButton>
                      <FiMoreHorizontal />
                    </MenuButton>
                  }>
              

                  {/* PINNED */}
                  <MenuItem className={'menuitem'} onClick={() => handlePinnedModal(groupData._id)}>
                    <span className='dropdown_icon'>
                      {
                        groupData.pinned.includes(user._id) ? <BsFillPinFill /> : <BsPin />
                      }
                    </span>
                    {
                      groupData.pinned.includes(user._id) ? <>Unpinn</> : <>Pinn</>
                    }
                  </MenuItem>

                  {/* LEAVE GROUP */}
                  {
                    user._id !== groupData.creator &&
                    <MenuItem className={'menuitem'} onClick={() => leaveModalHandler(groupData._id)}>
                      <span className='dropdown_icon'>
                        <AiOutlineUsergroupDelete />
                      </span>
                      Leave Group
                    </MenuItem>
                  }

                  {/* HIDE GROUP */}
                  {
                    user._id !== groupData.creator &&
                    <MenuItem className={'menuitem'} onClick={() => hideModalHandler(groupData._id)}>
                      <span className='dropdown_icon'>
                        <BiHide />
                      </span>
                      Hide Group
                    </MenuItem>
                  }

                  {/* visit group */}
                  <Link to={`/group/${groupData._id}`}>
                    <MenuItem className={'menuitem'}>
                      <span className='dropdown_icon'>
                        <GrView />
                      </span>
                      Visit Group
                    </MenuItem>
                  </Link>

                  {/* delete group */}
                  {
                    user._id === groupData.creator &&
                    <MenuItem className={'menuitem'} onClick={() => deleteModalHandler(groupData._id)}>
                      <span className='dropdown_icon'>
                        <BsTrash />
                      </span>
                      Delete Group
                    </MenuItem>
                  }
                  {
                    user._id !== groupData.creator &&
                    <MenuItem className={'menuitem'} onClick={() => reportModalHandler(groupData._id)}>
                      <span className='dropdown_icon'>
                        <BsTrash />
                      </span>
                      Report Group
                    </MenuItem>
                  }
                </Menu>
                <ToastContainer />
              </div>
          }
        </>
      }
    </>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupCard);