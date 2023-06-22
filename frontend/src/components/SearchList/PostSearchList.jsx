
import React from 'react';
import { connect } from "react-redux";
import { useNavigate } from 'react-router';
import UserAvatar from "../../Assets/userAvatar.webp";
import { setDrawer, setMobileDrawer } from "../../redux/page/page.actions";

const PostSearchList = ({ data, setDrawer, setMobileDrawer }) => {
  const navigate = useNavigate();
  const viewFullPost = (id) => {
    // alert(id);
    navigate(`/full/post/${id}`)
    setDrawer(false);
    setMobileDrawer(false) 
  }
  return (
    <>
      {
        data &&
        <div className='post_search_list_container' onClick={() => viewFullPost(data.id)}>
          {/* Post */}
          <div className='post_search_list_header'>
            <img src={data.u_img ? data.u_img : UserAvatar} className="user_avatar" />
              <span className='name'>{data.u_fn} {" "}{data.u_ln}</span>
              <span className='username'>@{data.u_dun}</span>
          </div>
          
            <div className='post_search_list_body'>{data.content}</div>
        </div>
      }
    </>
  )
};

const mapStateToProps = state => ({
  token: state.user.token,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
  isOpen: state.page.isOpen,
  openDrawer: state.page.openDrawer,
  recentData: state.search.recentData,
})

const mapDispatchToProps = dispatch => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
  setSearchPost: (data) => dispatch(addPost(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
  setDrawer: (data) => dispatch(setDrawer(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(PostSearchList);