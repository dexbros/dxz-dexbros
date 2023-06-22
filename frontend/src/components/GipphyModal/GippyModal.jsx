import React from 'react';
import "./GipphyModal.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from 'react';

const GifModal = ({ closeModal }) => {
  const [selectTab, setSelectTab] = useState("random")
  return (
    <div className='__modal_overlay'>
      <div className='__modal'>
        <div className='__modal_header'>
          <span className='modal_header_text'>Sticker</span>
          <button className="_modal_delete_close_btn">
            <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
          </button>
        </div>


        {/* Modal Body */}
        <div className='__group_modal_body'>
          {/* Modal Body Tabs */}
          <div className='modal_tab'>
            <button
              className={selectTab === 'random' ? 'modal_tab_list modal_tab_list_active' : 'modal_tab_list'}
              onClick={() => setSelectTab("random")}
            >Random</button>

            <button 
              className={selectTab === 'trending' ? 'modal_tab_list modal_tab_list_active' : 'modal_tab_list'}
              onClick={() => setSelectTab("trending")}>Trending</button>

            <button
              className={selectTab === 'search' ? 'modal_tab_list modal_tab_list_active' : 'modal_tab_list'}
              onClick={() => setSelectTab("search")}>Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GifModal