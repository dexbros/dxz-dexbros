import React from "react";
import { useParams, Link, Outlet, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { useSocket, socket } from "../../socket/socket";
import ProfileTab from "../../components/Tab/ProfileTab";
import {
  AiOutlineCamera,
  AiOutlineClose,
  AiFillEdit,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import MyModal from "../../components/modal/MyModal";
import { BsCloudUpload } from "react-icons/bs";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import Loader from "../../components/Loader/Loader";
import intToString from "../../utils/PostCount";
import { MdEmail } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const EarningAnalytics = ({ token, user }) => {
  return (
    <div className="earning_analytics_container">EarningAnalytics</div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, null)(EarningAnalytics);