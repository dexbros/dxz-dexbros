import React from 'react';
import { setBlockCast } from "../../redux/block/block.action";
import { connect } from "react-redux";
import { GrEdit } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import BlockCastSetting from "../BlockCastSetting/BlockCastSetting"
import "./blockcast.css"

const Blockcast = ({ token,
  user,
  posts,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost, setBlockCast, blockCast }) => {
  const [privateBlocks, setPrivateBlocks] = React.useState([]);

  // *** Fetch all public blockcast
  React.useEffect(() => {
    var axios = require('axios');
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/mine`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setPrivateBlocks(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [pinnedPost]);


  return (
    <div className='block_settings_container'>
      {
        (privateBlocks || []).length > 0 ?
          <>
          {
              privateBlocks.map(block => (
              <BlockCastSetting key={block.b_id} blockData={block} />
            ))
          }
          </> : <>Loading...</>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  blockCast : state.blockCast.blockCast
});

const mapDispatchToProps = (dispatch) => ({
  setBlockCast: (data) => dispatch(setBlockCast(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Blockcast);