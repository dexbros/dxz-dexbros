/** @format */

import React, { useEffect, useState } from "react";
import Layout from "../../layouts/main-layout.component";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./GroupEdit.css";
import { setUpdateGroup } from "../../redux/Group/group.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import BlockEditSkeleton from "../../components/SkeletonLoading/BlockEditSkeleton";

import Account from "./Comp/Account";
import Privacy from "./Comp/Rpivacy";
import Blockcast from "./Comp/BLockcast";

// Toolkit
import { useDispatch, useSelector } from "react-redux";
import { setPageType, setScrollAxis } from "../../redux/_page/pageSlice";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import {
  handleFetchBlock,
  setGroupData,
  handleCoverImage,
  setUpdatedGroupData,
  handleProfileImage,
  handleFetchGroupMembers,
  handleAddGroupMember,
} from "../../redux/_block/blockSlice";
import {
  selectGroupData,
  selectUpdatedGroupData,
} from "../../redux/_block/blockSelectors";
import { useTranslation } from "react-i18next";

const GroupEdit = ({ updatedGroup, groupData }) => {
  const { t } = useTranslation(["common"]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeState, setActiveState] = React.useState("acc");
  const [block, setBlock] = React.useState(null);

  React.useLayoutEffect(() => {
    dispatch(setPageType("block_page"));
  }, []);

  // ** Fecth block details
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = { token, id };
      const result = await dispatch(handleFetchBlock(data));
      setBlock(result);
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  return (
    <Layout title='Block settings'>
      {!isLoading ? (
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
                  {t("Account")}
                </li>
                <li
                  className={
                    activeState === "prv"
                      ? "block_settings_nav_btn active_block_settings_nav_btn"
                      : "block_settings_nav_btn"
                  }
                  onClick={() => setActiveState("prv")}>
                  {t("Privacy")}
                </li>
                <li
                  className={
                    activeState === "block"
                      ? "block_settings_nav_btn active_block_settings_nav_btn"
                      : "block_settings_nav_btn"
                  }
                  onClick={() => setActiveState("block")}>
                  {t("Blockcast")}
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
                      <Blockcast block={block} />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>{t("no block details found")}</div>
          )}
        </React.Fragment>
      ) : (
        <BlockEditSkeleton />
      )}
    </Layout>
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

export default GroupEdit;
