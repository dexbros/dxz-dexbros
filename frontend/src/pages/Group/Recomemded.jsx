/** @format */

import React from "react";
import { setPageType, setScrollAxis } from "../../redux/page/page.actions";
import GroupList from "../../components/GroupList/GroupList";
import { newRecomendedGroups } from "../../redux/Group/group.actions";
import { updateGroupPost } from "../../redux/Group/group.actions";
import "dexbrosicons/style.css";
import SkeletonList from "../../components/SkeletonLoading/SkeletonList";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { selectRecomendedGroup } from "../../redux/_block/blockSelectors";
import {
  handleFetchRecomendedBlock,
  addRecomended,
} from "../../redux/_block/blockSlice";

const Recomemded = ({ setScrollAxis, activeState }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const recomendedGroup = useSelector(selectRecomendedGroup);

  const [posts, setPosts] = React.useState([]);
  const [isType, setIsType] = React.useState("normal");
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [query, setQuery] = React.useState("Date");
  const [prevQuery, setPrevQuery] = React.useState("Date");
  const [openMenu, setOpenMenu] = React.useState(false);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  const fetchPosts = async () => {
    const data = { token, page, limit };
    const result = await dispatch(handleFetchRecomendedBlock(data));
    dispatch(addRecomended(result.data));
    setIsLoading(false);
    // setIsLoading(true);
    // const axios = require("axios");

    // let config = {
    //   method: "get",
    //   maxBodyLength: Infinity,
    //   url: `${process.env.REACT_APP_URL_LINK}api/group/block/recomendation?page=${page}&limit=${limit}`,
    //   headers: {
    //     Authorization: "Bearer " + token,
    //   },
    // };

    // axios
    //   .request(config)
    //   .then((response) => {
    //     setPosts(response.data);
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  React.useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [page, query, activeState]);

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
    // console.log(e.target.scrollTop);
    // setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      // console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection('up');
      // console.log("up");
      setScrollAxis("Up");
    }
    setPrevScrollDirection(currentScrollPos);
  }

  const handleSort = (e) => {
    setPosts([]);
    console.log(posts);
    let temp = query;
    setQuery(e.target.id);
    setPrevQuery(temp);
    setOpenMenu(false);
    if (prevQuery !== query) {
      console.log("Call");
      setPosts([]);
      setPage(1);
      // fetchPosts()
    }
  };

  return (
    <div>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <React.Fragment>
          {(recomendedGroup || []).length > 0 ? (
            <>
              {recomendedGroup.map((data) => (
                <GroupList groupData={data} />
              ))}
            </>
          ) : (
            <div className='empty_block_recomendation'>
              No active recomendation found
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  axisValue: state.page.axisValue,
  updatePost: state.group.updatePost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPageType: (type) => dispatch(setPageType(type)),
  newRecomendedGroups: (data) => dispatch(newRecomendedGroups(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
});

export default Recomemded;
