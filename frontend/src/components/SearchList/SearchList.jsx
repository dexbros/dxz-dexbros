/** @format */

import React from "react";
import Avatar from "react-avatar";
import { useNavigate } from "react-router";
import UserAvatar from "../../Assets/userAvatar.webp";
// import { setDrawer, setMobileDrawer } from "../../redux/page/page.actions";
// import { addRecentSearch, removeRecentSearch } from '../../redux/Search/search.actions';

import { selectToken } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import { setPageType, setDrawerHandler } from "../../redux/_page/pageSlice";
import { addToSearchHistory } from "../../redux/_user/userSlice";

const SearchList = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);

  const handleRedirect = (e, data) => {
    if (e.target.id === "user") {
      dispatch(
        addToSearchHistory({
          fn: data.fn,
          ln: data.ln,
          p_i: data.p_i,
          handleUn: data.handleUn,
        })
      );

      navigate(`/user/profile/${data.handleUn}`);
      // setDrawer(false);
      // setMobileDrawer(false)
    } else {
      navigate(`/group/${data.id}`);
      // setDrawer(!isOpen);
      // setMobileDrawer(!openDrawer)
    }
  };
  return (
    <React.Fragment>
      {data && (
        <div>
          {data.handleUn ? (
            <div
              id='user'
              className='search_user_list'
              onClick={(e) => handleRedirect(e, data)}>
              <img
                id='user'
                src={data.profilePic ? data.profilePic : UserAvatar}
                className='user_avatar_profile'
              />
              <span className='user_search_name' id='user'>
                {data.d_fn ? data.d_fn : data.fn}{" "}
                {data.d_ln ? data.d_ln : data.ln}
              </span>
              <span className='user_search_username' id='user'>
                @{data.handleUn && data.handleUn}
              </span>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  isOpen: state.page.isOpen,
  openDrawer: state.page.openDrawer,
});

const mapDispatchToProps = (dispatch) => ({
  setDrawer: (data) => dispatch(setDrawer(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
  addRecentSearch: (data) => dispatch(addRecentSearch(data)),
  removeRecentSearch: (data) => dispatch(removeRecentSearch(data)),
});

export default SearchList;

// /user/profile/account_three
// /group/1665561604600
