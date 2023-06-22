import React from 'react';
import { connect } from "react-redux";
import BlockcastList from '../../components/Blockcast_List/Blockcast_List';
// import { setPageType } from "../../redux/page/page.actions";
import { newPosts, updatePost, putPostsLast } from "../../redux/post/post.actions";

const BlockCastchannel = ({ token,
  user,
  posts,
  pinnedPost,
  newPosts,
  setPageType,
  updatePost }) => {
  const [privateBlocks, setPrivateBlocks] = React.useState([]);

  // *** Fetch all public blockcast
  React.useEffect(() => {
    var axios = require('axios');
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/join`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setPrivateBlocks(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [pinnedPost]);


  return (
    <div className='block_list_container'>
      {
        (privateBlocks || []).length > 0 ?
          <div className='block_list'>
            {
              privateBlocks.map(data => (
                <BlockcastList key={data.b_id} data={data} user={user} token={token} />
              ))
            }
          </div> :
          <div className='empty_list'>Empty join cast</div>
      }
    </div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockCastchannel);