/** @format */

import React from "react";
import GroupAvatar from "../../Assets/group.webp";
import { useNavigate } from "react-router";

const BlockSearchList = ({ blockData }) => {
  const navigate = useNavigate();

  const handleRedirect = (blockId, id) => {
    if (id === "block") {
      navigate(`/group/${blockId}`);
    }
  };

  return (
    <div
      id='block'
      className='__block_search_card'
      onClick={(e) => handleRedirect(blockData.b_id, e.target.id)}>
      <img id='block' src={GroupAvatar} className='__user_avatar_profile' />
      <div className='__block_info_section'>
        <span id='block' className='__block_card_name'>
          {blockData.b_n ? blockData.b_n : ""}
        </span>
        <span id='block' className='__block_card_type'>
          {blockData.b_t ? blockData.b_t : ""}
        </span>
        {/* <div id='block' className='block_card_bio'>
            {blockData.g_bio ? <>{blockData.g_bio.slice(0, 50)}...</> : ""}
          </div> */}
      </div>
    </div>
  );
};

export default BlockSearchList;
