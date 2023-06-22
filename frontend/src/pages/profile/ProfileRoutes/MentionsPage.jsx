import React from 'react';
import { connect } from "react-redux";
import PostCard from '../../../components/PostCardComp/PostCard';

const MentionsPage = ({ user, token }) => {
  const [posts, setPosts] = React.useState([]);

  const fetchPosts = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/posts/fetch/mentions", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setPosts(prev => [...prev, ...result]);
      })
      .catch(error => console.log('error', error));
  };

  React.useEffect(() => {
    fetchPosts();
  }, [token])



  return (
    <div className='mention_pageConteiner'>
      {
        (posts || []).length > 0 ?
          <div>
            {
              posts.map(post => (
                <PostCard key={post.id} postData={post} />
              ))
            }
          </div> : <div className='empty_mentions_lists'>No mentions available</div>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

export default connect(mapStateToProps, null)(MentionsPage);