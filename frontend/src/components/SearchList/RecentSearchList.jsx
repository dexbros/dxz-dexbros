import React from 'react';
import { connect } from "react-redux";
import { addRecentSearch, removeRecentSearch } from '../../redux/Search/search.actions';
import UserAvatar from "../../Assets/userAvatar.webp";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from 'react-router';
import { setDrawer } from "../../redux/page/page.actions";


const RecentSearchList = ({ data, addRecentSearch, removeRecentSearch, setDrawer }) => {
  const navigate = useNavigate();
  const handleClick = (id, data) => {
    if (id === "user") {
      navigate(`/user/profile/${data.handleUn}`);
      setDrawer(false);
    } else if (id === "delete") {
      removeRecentSearch(data.u_id);
      // alert(data.u_id)
    }
  }
  return (
    <React.Fragment>
      {
        data.handleUn ?
          <div id="user" className='recent_search_card' onClick={(e) => handleClick(e.target.id, data)}>
            <span id="user" className='name'>{data.fn}{" "}{data.ln}</span>
            <button id="delete" className="delete_list"><AiOutlineClose id="delete" /></button>
          </div> :
          <div></div>
      }
    </React.Fragment>
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
  addRecentSearch: (data) => dispatch(addRecentSearch(data)),
  removeRecentSearch: (data) => dispatch(removeRecentSearch(data)),
  setDrawer: (data) => dispatch(setDrawer(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(RecentSearchList);