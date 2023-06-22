/** @format */

import React from "react";
import { connect } from "react-redux";
import GroupList from "../../components/GroupList/GroupList";
// import {
//   newMyGroups,
//   addMyBlock,
//   removeMyBlock,
//   addBlocks,
//   addJoinBlock,
// } from "../../redux/Group/group.actions";
import SkeletonList from "../../components/SkeletonLoading/SkeletonList";

import { useSelector, useDispatch } from "react-redux";
import { selectMyGroup } from "../../redux/_block/blockSelectors";
import { selectUser, selectToken } from "../../redux/_user/userSelectors";
import { setScrollAxis } from "../../redux/_page/pageSlice";
import { addBlocks, fetchMyBlock } from "../../redux/_block/blockSlice";

const MyGroup = ({ activeState }) => {
  const dispatch = useDispatch();
  const myBlock = useSelector(selectMyGroup);
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const [groups, setGroups] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  function handleScroll(e) {
    const currentScrollPos = e.target.scrollTop;
    if (prevScrollDirection < currentScrollPos) {
      // console.log("DOWN");
      dispatch(setScrollAxis("Down"));
    } else {
      // console.log("UP");
      dispatch(setScrollAxis("Up"));
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
    async function fetchData() {
      setIsLoading(true);
      const data = { token };
      const result = await dispatch(fetchMyBlock(data));
      dispatch(addBlocks(result));
      setIsLoading(false);
    }
    fetchData();
  }, [activeState]);

  return (
    <div className='group_list_container' onScroll={(e) => handleScroll(e)}>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <>
          {(myBlock || []).length > 0 ? (
            <>
              {myBlock.map((group) => (
                <GroupList
                  key={group.g_id}
                  groupData={group}
                  token={token}
                  user={user}
                />
              ))}
            </>
          ) : (
            <div className='empty_block_list'>No block found</div>
          )}
        </>
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
  // myBlock: state.group.myBlock,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMyGroups: (data) => dispatch(newMyGroups(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  addMyBlock: (data) => dispatch(addMyBlock(data)),
  addBlocks: (data) => dispatch(addBlocks(data)),
});

export default MyGroup;
