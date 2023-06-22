import React, { useState } from 'react';
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import MyModal from "../../components/modal/MyModal";
import intToString from "../../utils/PostCount"
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
} from "../../redux/post/post.actions";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { useParams } from 'react-router-dom';
import GroupInfo from "../../components/Group.Info/GroupInfo"

const GroupInfoPage = ({ user, newPosts,token, pinnedPost, groupData }) => {

  const { id } = useParams();
  const [metaData, setMetaData] = useState(null);

  // Adding visitors
  React.useEffect(() => {
    if (user.handleUn !== groupData.g_c_dun) {
      var axios = require('axios');

      var config = {
        method: 'put',
        url: `${process.env.REACT_APP_URL_LINK}api/group/visitor/${id}`,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      axios(config)
        .then(function (response) {
          console.log((response.data));
        })
        .catch(function (error) {
          console.log(error);
        });

    }
  }, [])


  return (
    <div>
      {
        groupData ?
          <div className='group_info_container'>
            {/* Block coin type */}
            <div className='block_info_section'>Block coin type</div>
            {/* Block Banned word */}
            <div className='block_info_section'>Block Banned word</div>
            {/* Block members */}
            <div className='block_info_section'>Block members</div>
          </div> :
          <div className='loading_text'>Loading...</div>
      }
    </div>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  groupData: state.group.selectGroup
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupInfoPage);