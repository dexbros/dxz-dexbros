/** @format */

import React from "react";
import { connect, useSelector } from "react-redux";
import { setMobileDrawer } from "../../redux/page/page.actions";
import { BiArrowBack } from "react-icons/bi";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import SearchList from "../../components/SearchList/SearchList";
import RecentSearchList from "../../components/SearchList/RecentSearchList";
import { AiOutlineSearch } from "react-icons/ai";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
  addPost,
} from "../../redux/Search/search.actions";
import { BiSearchAlt2 } from "react-icons/bi";
import PostSearchList from "../SearchList/PostSearchList";

const MobileSearchForm = ({
  token,
  setSearchKey,
  setAllSearch,
  setAllSearchPeople,
  setAllSearchBlock,
  allSearchBlock,
  allSearchPeople,
  setDrawer,
  isOpen,
  setMobileDrawer,
  openDrawer,
  recentData,
  setSearchPost,
}) => {
  const [search, setSearch] = React.useState("");
  const [searchedPosts, setSearchedPosts] = React.useState([]);
  const [lists, setLists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (search.length === 2) {
      setLoading(true);
      handleSearchGroup(search);
    } else if (search.length > 2) {
      setLoading(true);
      const delayCall = setTimeout(() => {
        handleSearchGroup(search);
      }, 1000);

      return () => clearTimeout(delayCall);
    }
  }, [search]);

  const handleSearchGroup = async (search) => {
    setLoading(true);
    if (search.trim()) {
      try {
        const res = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${search}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          ),
          axios.get(
            `${process.env.REACT_APP_URL_LINK}api/posts/search/post?search=${search}` +
              search,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          ),
        ]);
        // console.log(res)
        const data = res.map((res) => res.data);
        var arr = [...data[0].user, ...data[1].block, ...data[2].posts];
        console.log(data);
        setLoading(false);
        setAllSearchPeople(data[0].user);
        setAllSearchBlock(data[1].block);
        setSearchPost(data[2].posts);
        setSearchedPosts(data[2].posts);
        setLists(arr);
        // setAllSearch(arr);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const handleToMain = () => {
    navigate("/main/search");
    setSearchKey(search);
    // setDrawer(false);
    setMobileDrawer(false);
  };

  return (
    <div className='mobile_search_form_container'>
      {/* Header */}
      <div className='mobile_search_header'>
        <button
          className='mobile_close_search_btn'
          onClick={() => setMobileDrawer(!openDrawer)}>
          <BiArrowBack />
        </button>
        <div className='input_search_section'>
          <input
            type='search'
            className='mobile_search_input'
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className='mobile_search_form_icon'>
            <BiSearchAlt2 />
          </span>
        </div>
      </div>

      <div className='search_list_container'>
        {loading ? (
          <div className='spinner_loading_container'>
            <ImSpinner2 className='spinner' />
          </div>
        ) : (
          <div className='search_card_container'>
            {(lists || []).length > 0 ? (
              <>
                {lists.map((list, index) => (
                  <SearchList key={index} data={list} />
                ))}
                <div
                  className='search_list_card search_more_container'
                  onClick={handleToMain}>
                  Search more with {search}{" "}
                  <AiOutlineSearch className='search_more_icons' />
                </div>
              </>
            ) : (
              <div className='search_card_container'>
                <span className='search_tag'>Recent search</span>
                {(recentData || []).length > 0 && (
                  <>
                    {recentData.map((list, index) => (
                      <RecentSearchList key={index} data={list} />
                    ))}
                  </>
                )}
              </div>
            )}
            {(searchedPosts || []).length > 0 &&
              searchedPosts.map((data) => (
                <>
                  <PostSearchList key={data.id} data={data} />
                </>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
  isOpen: state.page.isOpen,
  openDrawer: state.page.openDrawer,
  recentData: state.search.recentData,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
  setDrawer: (data) => dispatch(setDrawer(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
  setSearchPost: (data) => dispatch(addPost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobileSearchForm);
