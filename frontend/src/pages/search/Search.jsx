/** @format */

import * as React from "react";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../layouts/main-layout.component";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import "./Search.css";
import SearchList from "../../components/SearchList/SearchList";
import { AiOutlineSearch } from "react-icons/ai";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
} from "../../redux/Search/search.actions";
import SearchSkeleton from "../../components/SkeletonLoading/SearchSkeleton";

import { selectToken } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import { setPageType, setDrawerHandler } from "../../redux/_page/pageSlice";

function Search({
  token,
  setSearchKey,
  setAllSearch,
  setAllSearchPeople,
  setAllSearchBlock,
  allSearchBlock,
  allSearchPeople,
  isOpen,
}) {
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);

  const navigate = useNavigate();
  const textbox = React.useRef(null);

  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState("post");
  const [posts, setPosts] = React.useState(null);
  const [users, setUsers] = React.useState(null);
  const [lists, setLists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        // setDrawer(false);
        dispatch(setDrawerHandler(false));
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  React.useLayoutEffect(() => {
    console.log("Social_search");
    dispatch(setPageType("social_search"));
  }, []);

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
    try {
      const res = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + isToken,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + isToken,
            },
          }
        ),
      ]);
      const data = res.map((res) => res.data);
      var arr = [...data[0].user, ...data[1].block];
      console.log(arr);
      setLoading(false);
      setAllSearchPeople(data[0].user);
      setAllSearchBlock(data[1].block);
      setLists(arr);
      setAllSearch(arr);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleToMain = () => {
    navigate("/main/search");
    setSearchKey(search);
    // setDrawer(false);
    dispatch(setDrawerHandler(false));
  };

  return (
    <MainLayout>
      <div
        className={isOpen ? "serach_container" : "close_serach_container"}
        ref={menuRef}>
        <div className='search_input_container'>
          {/* <SearchIcon className='search_form_icon' /> */}
          <span class='icon search-v'></span>
          <input
            type={"search"}
            placeholder='Search something here...'
            className='search_form_input'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className='search_result_container'>
          {loading ? (
            <SearchSkeleton />
          ) : (
            <div>
              {(lists || []).length > 0 ? (
                <>
                  {lists.map((list, index) => (
                    <SearchList key={index} data={list} />
                  ))}
                  <div className='search_more_container' onClick={handleToMain}>
                    Search more with {search}{" "}
                    <AiOutlineSearch className='search_more_icons' />
                  </div>
                </>
              ) : (
                <span className='empty_text'>Nothing found</span>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
const mapStateToProps = (state) => ({
  token: state.user.token,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
  isOpen: state.page.isOpen,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
});

export default Search;
