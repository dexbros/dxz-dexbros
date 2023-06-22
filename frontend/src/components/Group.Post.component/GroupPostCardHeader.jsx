/** @format */

import React from "react";

const GroupPostCardHeader = ({ postData }) => {
  return (
    <div>
      <div className='block_post_header'>
        <div className='header_user_info'>
          <img
            src={postData.u_img || UserAvatar}
            className='user_post_avatar'
          />
          <span className='user_name'>
            {postData.u_fn} {postData.u_ln}
          </span>
          <span className='user_username'>{postData.u_dun}</span>
        </div>
        {!postData.is_share && (
          <Menu
            menuButton={
              <MenuButton className={"__menu_btn"}>
                <FiMoreHorizontal />
              </MenuButton>
            }>
            {user.handleUn === groupData.g_c_dun && (
              <MenuItem
                className={"block_post_menuItem"}
                onClick={() => handlePinnedModa(postData.p_id)}>
                <span className='block_dropdown_icon'>
                  <VscPinned />
                </span>
                {postData.pinned ? <>{t("Uninned")}</> : <>{t("Pinned")}</>}
              </MenuItem>
            )}

            <MenuItem
              className={"block_post_menuItem"}
              onClick={() => handleBookmarkPostModal(postData.p_id)}>
              <span className='block_dropdown_icon'>
                <BsFillBookmarkFill />
              </span>
              {t("Bookmark")}
            </MenuItem>

            {groupData.g_c_dun === user.handleUn && (
              <MenuItem
                className={"block_post_menuItem"}
                onClick={() => deleteModalHandler(postData.p_id)}>
                <span className='block_dropdown_icon'>
                  <BsTrash />
                </span>
                Delete
              </MenuItem>
            )}

            <MenuItem
              className={"block_post_menuItem"}
              onClick={() => handleHideModal(postData.p_id)}>
              <span className='block_dropdown_icon'>
                <MdHideSource />
              </span>
              {t("Hide")}
            </MenuItem>

            {postData.u_id === user.u_id && (
              <MenuItem
                className={"block_post_menuItem"}
                onClick={() => handleEditModal(postData.p_id, postData)}>
                <span className='block_dropdown_icon'>
                  <AiOutlineEdit />
                </span>
                {t("Edit")}
              </MenuItem>
            )}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default GroupPostCardHeader;
