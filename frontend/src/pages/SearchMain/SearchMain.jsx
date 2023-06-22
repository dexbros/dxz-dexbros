/** @format */

import React from "react";
import MainLayout from "../../layouts/main-layout.component";
import { BiSearchAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchList from "../../components/SearchList/SearchList";
import { AiOutlineSearch } from "react-icons/ai";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
  addPost,
} from "../../redux/Search/search.actions";
import SearchSkeletonLoader from "../../components/SkeletonLoading/SearchSkeletonLoader";

import { selectToken } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import { setPageType, setDrawerHandler } from "../../redux/_page/pageSlice";
import { fetchAllSearchResult } from "../../redux/_search/searchSlice";

import { selectSearchResult } from "../../redux/_search/searchSelectors";

const SearchMain = () => {
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);
  const lists = useSelector(selectSearchResult);

  const [search, setSearch] = React.useState("");
  const [searchedPosts, setSearchedPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    dispatch(setPageType("search_page"));
  });

  React.useEffect(() => {
    if (search.length === 2) {
      setLoading(true);
      setErr("");
      // handleSearchGroup(search);
      const data = { search, isToken };
      dispatch(fetchAllSearchResult(data));
      setLoading(false);
    } else if (search.length > 2) {
      setLoading(true);
      setErr("");
      const data = { search, isToken };
      dispatch(fetchAllSearchResult(data));
      setLoading(false);
    } else if (search.length === 1) {
      setLoading(false);
      setErr("Minimum 2 characters are required to start searching");
    } else {
      setLoading(false);
    }
  }, [search]);

  // const handleSearchGroup = async (search) => {
  //   setLoading(true);
  //   if (search.trim()) {
  //     try {
  //       const res = await Promise.all([
  //         axios.get(
  //           `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${search}`,
  //           {
  //             headers: {
  //               Authorization: "Bearer " + isToken,
  //             },
  //           }
  //         ),
  //         axios.get(
  //           `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
  //           {
  //             headers: {
  //               Authorization: "Bearer " + isToken,
  //             },
  //           }
  //         ),
  //         axios.get(
  //           `${process.env.REACT_APP_URL_LINK}api/posts/search/post?search=${search}` +
  //             search,
  //           {
  //             headers: {
  //               Authorization: "Bearer " + isToken,
  //             },
  //           }
  //         ),
  //       ]);
  //       // console.log(res);
  //       const data = res.map((res) => res.data);
  //       var arr = [...data[0].user, ...data[1].block, ...data[2].posts];
  //       console.log(data);
  //       setLoading(false);
  //       setAllSearchPeople(data[0].user);
  //       setAllSearchBlock(data[1].block);
  //       setSearchPost(data[2].posts);
  //       setSearchedPosts(data[2].posts);
  //       setLists(arr);
  //       // setAllSearch(arr);
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     }
  //   }
  // };

  const handleToMain = () => {
    navigate("/main/search");
    setSearchKey(search);
    // setDrawer(false);
    setMobileDrawer(false);
  };

  return (
    <MainLayout title='Search'>
      <div className='search_main_page_header'>
        <BiSearchAlt className='__search_icon' />
        <input
          type='search'
          placeholder='Search...'
          className='search_header_input'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <SearchSkeletonLoader />
      ) : (
        <React.Fragment>
          {err ? (
            <div className='empty_search_list'>{err}</div>
          ) : (
            <>
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
                <div className='empty_search_list'>No search result</div>
              )}
            </>
          )}
        </React.Fragment>
      )}
    </MainLayout>
  );
};

export default SearchMain;
