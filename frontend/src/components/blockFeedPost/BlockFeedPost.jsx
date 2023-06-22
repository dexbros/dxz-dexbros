import React from 'react';
import UserAvatar from "../../Assets/userAvatar.webp";
import { FiMoreHorizontal } from "react-icons/fi";
import { Menu, MenuItem, MenuButton, SubMenu  } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const BlockFeedPost = ({ data }) => {
  return (
    <div className='post_feed_card'>
      <div className='block_post_header'>
        <div className='header_user_info'>
          <img src={data.u_img || UserAvatar} className='user_post_avatar' />
          <span className='user_name'>{data.u_fn} {data.u_ln}</span>
          <span className='user_username'>{data.u_dun}</span>
        </div>
        <Menu
          menuButton={
            <MenuButton className={'__menu_btn'}>
              <FiMoreHorizontal />
            </MenuButton>
          }>
          <MenuItem
            className={'block_post_menuItem'}>View block</MenuItem>
        </Menu>
      </div>

      <div className='block_post_body'>
        <span className='block_post_content'>{data.content}</span>
        {
          data.image &&
          <img src={data.image} className="block_post_image" />
        }
      </div>
    </div>
  )
};
export default BlockFeedPost