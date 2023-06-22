/** @format */

import React from "react";
import { newMyGroups } from "../../redux/Group/group.actions";
import BlockSearchList from "../../components/SearchList/BlockSearchList";
import SearchSkeleton from "../../components/SkeletonLoading/SearchSkeleton";
import { useNavigate } from "react-router";
import GroupList from "../../components/GroupList/GroupList";
import { addBlock } from "../../redux/Search/search.actions";
import { setScrollAxis } from "../../redux/page/page.actions";

import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import {handleBlockSearch} from "../../redux/_block/blockSlice"

const BlockSearch = ({ setAllSearchBlock, setScrollAxis }) => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [blocks, setBlocks] = React.useState("");
  const [visibleSuggestion, setVisibleSuggestion] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  function handleScroll(e) {
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection('up');
      console.log("up");
      setScrollAxis("Up");
    }
    setPrevScrollDirection(currentScrollPos);
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  React.useEffect(() => {
    if (search.length === 2) {
      setIsLoading(true);
      handleSearchGroup(search);
    } else if (search.length > 2) {
      setIsLoading(true);
      const delayCall = setTimeout(() => {
        handleSearchGroup(search);
      }, 1000);

      return () => clearTimeout(delayCall);
    }
  }, [search]);

  React.useEffect(() => {
    setIsLoading(true);
    var axios = require("axios");
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setIsLoading(false);
        setGroups(response.data);
        // newRecomendedGroups(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleSearchGroup = async () => {
    const data = { search, token };
    const result = await dispatch(handleBlockSearch(data));
    console.log(result)
    // var axios = require("axios");
    // var config = {
    //   method: "get",
    //   url: `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
    //   headers: {
    //     Authorization: "Bearer " + token,
    //   },
    // };
    // axios(config)
    //   .then(function (response) {
    //     console.log(JSON.stringify(response.data));
    //     setIsLoading(false);
    //     setBlocks(response.data.block);
    //     setAllSearchBlock(response.data.block);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  return (
    <div className='group_list_container'>
      {/* Search Input */}
      <div className='search_input_container'>
        {/* <SearchIcon className='search_form_icon' /> */}
        <span class='icon search-v'></span>
        <input
          type='text'
          placeholder='Search block'
          className='search_form_input'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => serachBlcok(e.target.value)}
          onFocus={() => setVisibleSuggestion(true)}
        />
      </div>

      {/* Rendering block lists */}
      {visibleSuggestion ? (
        <div>
          {isLoading ? (
            <SearchSkeleton />
          ) : (
            <React.Fragment>
              {(blocks || []).length > 0 ? (
                <div>
                  {blocks.map((data) => (
                    <BlockSearchList key={data.b_id} blockData={data} />
                  ))}

                  <button
                    className='search_more_btn'
                    onClick={() => navigate("/main/search")}>
                    Find more
                  </button>
                </div>
              ) : (
                <div className='empty_block_list'>No block found</div>
              )}
            </React.Fragment>
          )}
        </div>
      ) : (
        <div>
          {groups.map((group) => (
            <GroupList
              key={group.g_id}
              groupData={group}
              token={token}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setScrollAxis: (type) => dispatch(setScrollAxis(type)),
  newMyGroups: (data) => dispatch(newMyGroups(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
});

export default BlockSearch;
