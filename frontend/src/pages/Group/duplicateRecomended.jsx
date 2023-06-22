import React from 'react';
import { connect } from "react-redux";
import { setPageType, setScrollAxis } from "../../redux/page/page.actions";
import GroupList from '../../components/GroupList/GroupList';
import { newRecomendedGroups } from "../../redux/Group/group.actions";
import SkeletonList from '../../components/SkeletonLoading/SkeletonList';
import BlockFeedPost from '../../components/blockFeedPost/BlockFeedPost';
import EventComp from '../../components/EventComp/EventComp';
import Test from '../../components/Group.Post.component/Test';
import { FiFilter } from "react-icons/fi";
import { addGroupPost, updateGroupPost, deleteGroupPost, addPostComment, updatePostComment, deletePostComment } from "../../redux/Group/group.actions";


const Recomemded = ({ token,
  user, setScrollAxis, newRecomendedGroups, axisValue, updatePost, updateGroupPost }) => {
  const [posts, setPosts] = React.useState([]);
  const [isType, setIsType] = React.useState("normal");
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [query, setQuery] = React.useState("Date");
  const [prevQuery, setPrevQuery] = React.useState("Date");
  const [openMenu, setOpenMenu] = React.useState(false);

  const fetchPosts = () => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/block/feed?page=${page}&limit=${limit}&key=${query}`,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // console.log("prevQuery ", prevQuery)
        // console.log("Query ", query);
        // setPosts(prev => [...prev, ...response.data])
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  React.useEffect(() => {
    setIsLoading(true)
    fetchPosts();
  }, [page, query, updatePost, updateGroupPost]);

  const scrollContainerRef = React.useRef(null);

  // **** Handle emoji button
  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenMenu(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  function handleScroll(e) {
    console.log(e.target.scrollTop);
    setScrollAxis(e.target.scrollTop);
    let cl = e.currentTarget.clientHeight;
    // console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    // console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  const handleSort = (e) => {
    setPosts([]);
    console.log(posts)
    let temp = query;
    setQuery(e.target.id);
    setPrevQuery(temp);
    setOpenMenu(false);
    if (prevQuery !== query) {
      console.log("Call")
      setPosts([]);
      setPage(1)
      // fetchPosts()
    }
  }

  return (
    <div>
      <div className='sort_section'>
        <span className='sort_text'><FiFilter className='filter_icon' />Sorted by</span>
        <button className='sort_button' onClick={() => setOpenMenu(true)}>{query}</button>
        {
          openMenu &&
          <div className='sort_menu_section' ref={wrapperRef}>
              <li className='sort_list' id={'Date'} onClick={(e) => handleSort(e)}>By date</li>
              <li className='sort_list' id={'Recomended'} onClick={(e) => handleSort(e)}>Recomendation</li>
              <li className='sort_list' id={'Event'} onClick={(e) => handleSort(e)}>Only events</li>
          </div>
        }
      </div>
      {
        (posts || []).length > 0 ?
          <div className='block_feed_container' ref={scrollContainerRef} onScroll={e => handleScroll(e)}>
            {
              posts.map(post => (
                <div key={post.p_id}>
                  {
                    post.isEvent ?
                      <EventComp key={post.p_id} eventData={post} />
                      :
                      <Test key={post.p_id} postData={post} />
                }
                </div>
              ))
            }
          </div> : null
      }
    </div>
  )
};
const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  axisValue: state.page.axisValue,
  updatePost: state.group.updatePost
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPageType: (type) => dispatch(setPageType(type)),
  newRecomendedGroups: (data) => dispatch(newRecomendedGroups(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Recomemded);