/** @format */

import React from "react";
import { connect } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";
import BlockAccount from "./BlockComp/BlockAccount";
import BlockPrivacy from "./BlockComp/BlockPrivacy";

const Blockcast = ({ user, token, setUpdateGroup, updatedGroup, block }) => {
  const { id } = useParams();
  const [selectTab, setSelectTab] = React.useState("acc");
  const [isLoading, setIsLoading] = React.useState(false);
  const [blockcast, setBlockcast] = React.useState(null);

  React.useEffect(() => {
    const axios = require("axios");
    let data = JSON.stringify({
      join_prv: "none",
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/blockcast/${id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        setBlockcast(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <React.Fragment>
      {isLoading ? (
        <>Loading</>
      ) : (
        <React.Fragment>
          {blockcast ? (
            <div className='blockcast_setting_page'>
              {/* Blockcast privacy tab section */}
              <div className='blockcast_privacy_tab_section'>
                <li
                  className={
                    selectTab === "acc"
                      ? "blockcast_tab active_blockcast_tab"
                      : "blockcast_tab"
                  }
                  onClick={() => setSelectTab("acc")}>
                  Basic Settings
                </li>
                <li
                  className={
                    selectTab === "prv"
                      ? "blockcast_tab active_blockcast_tab"
                      : "blockcast_tab"
                  }
                  onClick={() => setSelectTab("prv")}>
                  Privacy Settings
                </li>
              </div>

              {/* Tab content rendering */}
              <div className='tab_content_section'>
                {selectTab === "acc" ? (
                  <BlockAccount blockcast={blockcast} />
                ) : (
                  <BlockPrivacy blockcast={blockcast} />
                )}
              </div>
            </div>
          ) : (
            <div className='empty_blockcast_setting_page'>No block found</div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  groupData: state.group.groupData,
  updatedGroup: state.group.updatedGroup,
  groupData: state.group.selectGroup,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blockcast);
