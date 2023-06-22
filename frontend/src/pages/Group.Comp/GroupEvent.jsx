/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import {
  setNewPinnedPost,
  updatePost,
  newPosts,
} from "../../redux/post/post.actions";
import EventComp from "../../components/EventComp/EventComp";
import { updateGroupPost } from "../../redux/Group/group.actions";
import { addEvents } from "../../redux/GroupPost/groupPost.action";
import EventSkeletonLoading from "../../components/SkeletonLoading/EventSkeletonLoading";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";

const GroupEvent = ({ token, events, addEvents, activeState }) => {
  const { id } = useParams();
  // const [events, setEvents] = useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filter, setFilter] = React.useState("all");

  // *** Fetch block events
  React.useEffect(() => {
    setIsLoading(true);
    var axios = require("axios");

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_URL_LINK}api/group/post/events/${id}?page=${page}&limit=${limit}&filter=${filter}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        addEvents(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id, updatePost, updateGroupPost, page, activeState, filter]);

  const suggestedUserScrollHandler = (e) => {
    console.log("Page ", page);
    let cl = e.currentTarget.clientHeight;
    // console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy)
    let sh = e.currentTarget.scrollHeight;
    // console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <EventSkeletonLoading />
      ) : (
        <div>
          <div className='filter_section'>
            <Menu
              menuButton={
                <MenuButton className={"event_filter_menu"}>
                  <FiFilter />
                  <span className='menu_btn_text'>
                    {filter == "all" ? (
                      <>All</>
                    ) : (
                      <>
                        {filter === "int" ? (
                          <>Most interested</>
                        ) : (
                          <>
                            {filter === "nint" ? (
                              <>Most Not-interested</>
                            ) : (
                              <>
                                {filter === "join" ? (
                                  <>Most Joined</>
                                ) : (
                                  <>
                                    {filter === "actv" ? (
                                      <>Active events</>
                                    ) : null}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </span>
                </MenuButton>
              }>
              <MenuItem onClick={() => setFilter("all")}>
                {filter === "all" ? <BiRadioCircleMarked /> : <BiRadioCircle />}
                <span className='menu_text'>All</span>
              </MenuItem>

              <MenuItem onClick={() => setFilter("int")}>
                {filter === "int" ? <BiRadioCircleMarked /> : <BiRadioCircle />}
                <span className='menu_text'>Most Interest</span>
              </MenuItem>

              <MenuItem onClick={() => setFilter("nint")}>
                {filter === "nint" ? (
                  <BiRadioCircleMarked />
                ) : (
                  <BiRadioCircle />
                )}
                <span className='menu_text'>Most Not-Interest</span>
              </MenuItem>

              <MenuItem onClick={() => setFilter("join")}>
                {filter === "join" ? (
                  <BiRadioCircleMarked />
                ) : (
                  <BiRadioCircle />
                )}
                <span className='menu_text'>Most Joined</span>
              </MenuItem>
            </Menu>
          </div>
          {(events || []).length > 0 ? (
            <div
              className={"block_event_container block_event_container_scroll"}>
              {events.map((event) => (
                <EventComp key={event.e_id} eventData={event} />
              ))}
            </div>
          ) : (
            <div className='empty_event_container'>No event set</div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  updatedGroup: state.group.updatedGroup,
  selectGroup: state.group.selectGroup,
  axisValue: state.page.axisValue,
  events: state.groupPost.events,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  // updatePost: (post) => dispatch(updatePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setGroupData: (data) => dispatch(setGroupData(data)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
  addEvents: (data) => dispatch(addEvents(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupEvent);
