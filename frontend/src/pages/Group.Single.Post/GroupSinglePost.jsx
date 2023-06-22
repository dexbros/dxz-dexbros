import React,{useState, useEffect} from 'react';
import Layout from "../../layouts/main-layout.component";
import { useParams } from 'react-router-dom';
import { userLogin } from "../../redux/user/user.actions";
import { connect } from 'react-redux';
import GroupPost from '../../components/Group.Post.component/Test.jsx';
import "../Group/Group.css";
import { updatePost, setNewPinnedPost, pinnedPost } from "../../redux/post/post.actions";
import { addGroupPost, updateGroupPost, deleteGroupPost, addPostComment, updatePostComment, deletePostComment } from "../../redux/Group/group.actions";

const GroupSinglePost = ({token, user, pinnedPost, setPinnedPost, updateGroupPost, updatePost}) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}/api/group/post/full-post/${id}`,
      headers: {
        'Authorization': 'Bearer '+token
      }
    };

    axios(config)
      .then(function (response) {
        console.log(response);
        setPost(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id, updatePost, updateGroupPost]);

  return (
    <Layout>
      <div>
        {
          post ?
            <GroupPost postData={post} /> :
            <div>Loading...</div>
        }
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  pinnedPost: state.post.pinnedPost,
  spamList: state.user.spam,
  sharesList: state.user.shares,
  updatePost: state.group.updatePost
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  deletePost: (post) => dispatch(deletePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  addToLikeArray: (post) => dispatch(addToLike(post)),
  removeToLike: (post) => dispatch(removeToLike(post)),
  addToSpam: (post) => dispatch(addToSpam(post)),
  removeToSpam: (post) => dispatch(removeToSpam(post)),
  removeToShares: (post) => dispatch(removeToShares(post)),
  addToShares: (post) => dispatch(addToShares(post)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupSinglePost);