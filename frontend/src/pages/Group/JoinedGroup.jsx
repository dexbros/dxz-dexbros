/** @format */

import React from "react";
import GroupList from "../../components/GroupList/GroupList";
import SkeletonList from "../../components/SkeletonLoading/SkeletonList";

import { useSelector, useDispatch } from "react-redux";
import { joinedBlock, fetchJoinedBlock } from "../../redux/_block/blockSlice";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { scrollAxis } from "../../redux/_page/pageSelectors";
import { selectJoinGroups } from "../../redux/_block/blockSelectors";

const JoinedGroup = ({ activeState }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const axisValue = useSelector(scrollAxis);
  const groups = useSelector(selectJoinGroups);

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      const data = { token };
      const result = await dispatch(fetchJoinedBlock(data));
      console.log("**** Joined Block *****");
      console.log(result);
      dispatch(joinedBlock(result));
      setIsLoading(false);
    }
    fetchData();
  }, [activeState]);

  return (
    <div
      className={
        axisValue > 1
          ? "group_list_container full_screen_block"
          : "group_list_container"
      }>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <React.Fragment>
          {(groups || []).length > 0 ? (
            <div className='group_list_card_container'>
              {groups.map((group) => (
                <GroupList
                  key={group.g_id}
                  groupData={group}
                  token={token}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className='empty_join_group'>No group found</div>
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
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newJoinGroups: (data) => dispatch(newJoinGroups(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default JoinedGroup;
