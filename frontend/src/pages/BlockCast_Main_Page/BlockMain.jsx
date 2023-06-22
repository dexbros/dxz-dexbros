/** @format */

import React from "react";
import Layout from "../../layouts/main-layout.component";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { NavLink, Outlet } from "react-router-dom";
import MyModal from "../../components/modal/MyModal";
import { useParams } from "react-router-dom";
import { AiOutlineCamera } from "react-icons/ai";
import "./BlockMain.css";
import Form from "../../components/BlockCastForm/Form";
import CastFeed from "./CastFeed";
import {
  setBlockCast,
  updatBlockCast,
  selectBlockcast,
} from "../../redux/block/block.action";
import { io } from "socket.io-client";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { GrMore } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";

const END_POINT = "http://localhost:5000";
var socket, selectedChatCompare;

const BlockMain = ({
  token,
  user,
  selectBlockcast,
  setPageType,
  selectBlock,
  updatedBlock,
}) => {
  const { navigate } = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const [blockData, setBlockData] = React.useState(null);
  const [currentPath, setCurrentPath] = React.useState(pathname);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeState, setActiveState] = React.useState("feed");

  const fetchData = (id) => {
    setIsLoading(true);
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("** START **");
        console.log(response.data);
        console.log("** END **");
        // setBlockData(response.data);
        selectBlockcast(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchData(id);
  }, [id, updatedBlock]);

  React.useLayoutEffect(() => {
    setPageType("blockcast_main_page");
  }, []);

  const redirectToSettings = () => {
    navigate("/settings/blockcast");
  };

  return (
    <React.Fragment>
      <>
        {selectBlock ? (
          <Layout goBack={true}>
            <div className='block_cast_message_container'>
              <div className='block_cast_nested_container'>
                <NavLink
                  to=''
                  className={
                    !pathname.includes("/dm") && !pathname.includes("/comments")
                      ? "active_block_channel_navlink_item block_channel_navlink_item"
                      : "block_channel_navlink_item"
                  }>
                  Cast feed
                </NavLink>

                <NavLink
                  to='comments'
                  className={
                    pathname.includes("/comments")
                      ? "active_block_channel_navlink_item block_channel_navlink_item"
                      : "block_channel_navlink_item"
                  }>
                  Comments
                </NavLink>

                {selectBlock.b_c_un === user.handleUn && (
                  <NavLink
                    to='dm'
                    className={
                      pathname.includes("/dm")
                        ? "active_block_channel_navlink_item block_channel_navlink_item"
                        : "block_channel_navlink_item"
                    }>
                    DM's
                  </NavLink>
                )}
              </div>
              <Outlet />
            </div>
          </Layout>
        ) : (
          <div className='empty_blockcast'>Nothing found</div>
        )}
      </>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast: state.blockCast.blockCast,
  updatedBlock: state.blockCast.updatedBlock,
  selectBlock: state.blockCast.selectBlock,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setBlockCast: (data) => dispatch(setBlockCast(data)),
  updatBlockCast: (data) => dispatch(updatBlockCast(data)),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockMain);

// {
//   blockData ? (
//     <Layout goBack={true}>
//       <div className={"block_cast_message_container"}></div>
//     </Layout>
//   ) : (
//     <span class='__loader__'></span>
//   );
// }
