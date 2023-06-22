import React from 'react';
import { connect } from "react-redux";
import Layout from "../../layouts/main-layout.component";
import { setPageType } from "../../redux/page/page.actions";
import { useParams } from 'react-router';
import HeaderTitle from '../../components/HeaderTitle/HeaderTitle';
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts
} from "../../redux/post/post.actions";
import "./GroupPost.css";

const GroupRecomendation = ({ token,
  user,
  posts,
  pinnedPost,setPinnedPost,
  newPosts,
  setPageType,
  updatePost, newMyGroups }) => {
  const { id } = useParams();
  
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // *** Fetch all recomended users
  React.useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(`${process.env.REACT_APP_URL_LINK}api/group/add/users/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUsers(result);
      })
      .catch(error => console.log('error', error));
  }, [id, pinnedPost]);

  // *** Add new user into group
  const addUserToGroup = (id, handleUn) => {
    setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "groupId": id,
      "userDisplayUsername": handleUn
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}/api/group/join/group`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result)
        setIsLoading(false);
        setPinnedPost(result);
      })
      .catch(error => console.log('error', error));
  };


  return (
    <Layout goBack={true} title={
      <HeaderTitle
        content={"Blocks Recomendations"}
      />
    }>
      <div className='group_recomendation_container'>
        <input type="serach" placeholder='Search user by name' className='recomended_user_input' />
      </div>
      <span className="reco_header">Select user to add into block</span>

      <div className='remonded_list'>
        {
          (users || []).length > 0 ?
            <div>
              {
                users.map(user => (
                  <div className='reco_card' key={user.P_K}>
                    <div className='reco_user_info'>
                    <img src={user.p_i} className="reco_user_img" />
                      <span className='reco_user_name'>{user.f_n} {user.l_n}</span>
                      <span className='reco_user_username'>@{user.d_u}</span>
                    </div>
                    <button
                      className='add_group_btn'
                      onClick={() =>addUserToGroup(id, user.d_u)}
                    >
                      Add
                    </button>
                  </div>
                ))
              }
            </div> : <div className='empty_msg'>No recomended user found</div>
        }
      </div>
    </Layout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMyGroups: (data) => dispatch(newMyGroups(data)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupRecomendation);