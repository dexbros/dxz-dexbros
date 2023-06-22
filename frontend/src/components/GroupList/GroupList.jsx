/** @format */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import GroupAvatar from "../../Assets/group.webp";
import "dexbrosicons/style.css";
import { BiUserPlus, BiUserCheck, BiMessageAltDots } from "react-icons/bi";

import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { selectRecomendedGroup } from "../../redux/_block/blockSelectors";
import { handleAddGroupMember } from "../../redux/_block/blockSlice";

const GroupList = ({ groupData }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const recomendedGroup = useSelector(selectRecomendedGroup);

  const [isLoading, setIsLoading] = React.useState(false);
  const [members, setMembers] = React.useState(groupData.g_mem || []);
  const navigate = useNavigate();

  const handleClick = (e, id, handleUn) => {
    if (e.target.id === "join") {
      console.log("Join");
      addUserToGroup(id, handleUn);
    } else {
      handleRedirect(e, id);
    }
  };

  const handleRedirect = (e, id) => {
    e.stopPropagation();
    // console.log("Outer")
    navigate(`/group/${id}`);
  };

  const handleCreateMessage = (group) => {
    // console.log(group);
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);
    // myHeaders.append("Content-Type", "application/json");
    // var raw = JSON.stringify({
    //   group: group,
    //   user: user,
    // });
    // var requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };
    // fetch(
    //   "http://localhost:5000/api/blockcast/dm/" + group.g_id,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     navigate(`/blockcast/dm/${result.chat.b_id}`);
    //     selectBlockcast(result.chat);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  const followedGroup = (id) => {
    if (members.includes(user.handleUn)) {
      const arr = members;
      const temp = arr.filter((data) => data !== user.handleUn);
      setMembers(temp);
    } else {
      console.log("Not includes");
      setMembers((prev) => [...prev, user.handleUn]);
    }
    const data = { token, id };
    dispatch(handleAddGroupMember(data));
    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);

    // var requestOptions = {
    //   method: "PUT",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // fetch(
    //   `${process.env.REACT_APP_URL_LINK}api/group/follow/${id}`,
    //   requestOptions
    // )
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  return (
    <React.Fragment>
      <div className='block_card_container'>
        <img
          src={groupData.g_p_img ? groupData.g_p_img : GroupAvatar}
          className='block_avatar'
          onClick={(e) => handleClick(e, groupData.g_id, user.handleUn)}
        />

        <div
          className='block_information'
          onClick={(e) => handleClick(e, groupData.g_id, user.handleUn)}>
          <div className='block_primary_info'>
            <span className='block_card_name'>{groupData.g_n}</span>
            <span className='block_card_crypto_name'>{groupData.g_type}</span>
            {groupData.symbol == "" ? (
              <span className='no_block_symbol'>(?)</span>
            ) : (
              <span
                class={`icon icon-${groupData.symbol} block_card_crypto_icon`}></span>
            )}
            <br />
            <span className='block_card_bio'>
              {groupData.g_bio.slice(0, 70)}
            </span>
            <br />
            <span className='block_card_mem_count'>
              Members: {members.length}
            </span>
          </div>
        </div>

        {groupData.g_c_dun !== user.handleUn && (
          <div className='block_buttons_section'>
            <button
              className='join_block_btn'
              onClick={() => followedGroup(groupData.g_id)}>
              {members.includes(user.handleUn) ? (
                <BiUserCheck className='join_block_icon joined_block_icon' />
              ) : (
                <BiUserPlus className='join_block_icon' />
              )}
            </button>

            {/* Message */}
            {/* <button
              className='block_msg_btn'
              onClick={() => navigate(`/blockcast/${groupData.chatId}`)}>
              <BiMessageAltDots className='block_msg_icon' />
            </button> */}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default GroupList;
