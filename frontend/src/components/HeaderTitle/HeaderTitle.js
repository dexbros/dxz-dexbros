import React from 'react';
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { FiMoreHorizontal } from "react-icons/fi";
import "./HeaderTitle.css";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";


const HeaderTitle = ({ firstName, lastName, content, isSearch, isVisible, search, searchIcon, searchInput }) => {
  return (
    <div className='header_title_container'>
      {
        isVisible ?
          <div className='input_container'>
          {searchInput}
          </div> :
          <div className='normal_header'>
            <div className='content_container'>
              {
                content ? <>{content}</> : <>{firstName} {" "} {lastName}</>
              }
            </div>
            {searchIcon}
          </div>
      }
    </div>
  )
};

export default HeaderTitle;