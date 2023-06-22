/** @format */

import React from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { BiUserPlus, BiUserCheck } from "react-icons/bi";
import UserAvatar from "../../Assets/userAvatar.webp";
import {
  joinBlockcast,
  removeBlockCast,
  selectBlockcast,
  unselectBlockcast,
} from "../../redux/block/block.action";

const Blockcast_List = ({
  data,
  token,
  user,
  joinBlockcast,
  removeBlockCast,
  join,
  selectBlockcast,
}) => {
  const history = useNavigate();
  const [members, setMembers] = React.useState(data.mem);
  const [membersCount, setMembersCount] = React.useState(data.mem.length);

  const handleAddBlock = (id) => {
    if (members.includes(user.handleUn)) {
      let arr = members;
      arr.filter((data) => data === user.handleUn);
      setMembers(arr);
      setMembersCount((prev) => prev - 1);
    } else {
      setMembers((prev) => [...prev, user.handleUn]);
      setMembersCount((prev) => prev + 1);
    }
    var axios = require("axios");
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/add-remove/blockcast/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClick = (e, data) => {
    if (e.target.id === "main") {
      console.log(data);
      history("/blockcast/" + data.b_id);
      selectBlockcast(data);
    } else if (e.target.id === "join") {
      handleAddBlock(data.b_id);
    }
  };
  return (
    <React.Fragment>
      {!data.isDelete && (
        <div
          className='__blockcast_card'
          id='main'
          onClick={(e) => handleClick(e, data)}>
          <div className='block_cast_box' id='main'>
            {/* Block image */}
            <img
              src={data.b_p_img || UserAvatar}
              className='block_avatar'
              id='main'
            />
            {/* Block information */}
            <div className='blockcast_card_info_section' id='main'>
              <span className='blockcast_name' id='main'>
                {data.name}
              </span>
              <span className='blockcast_cryptoname' id='main'>
                {data.crypto || ""}
              </span>
              <br />
              <span className='block_members' id='main'>
                Total members: {data.mem.length || 1}
              </span>
              <br />
              <span className='block_description_text' id='join'>
                {data.des || ""}
              </span>
            </div>
          </div>

          {/* Block button */}
          {data.b_c_un !== user.handleUn && (
            <button className='block_cast_join_button' id='join'>
              {members.includes(user.handleUn) ? (
                <BiUserCheck id='join' className='join_block' />
              ) : (
                <BiUserPlus id='join' className='not_join_block' />
              )}
            </button>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  join: state.blockCast.join,
});

const mapDispatchToProps = (dispatch) => ({
  joinBlockcast: (data) => dispatch(joinBlockcast(data)),
  removeBlockCast: (data) => dispatch(removeBlockCast(data)),
  selectBlockcast: (data) => dispatch(selectBlockcast(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blockcast_List);
