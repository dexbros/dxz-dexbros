/** @format */

import React, { useState } from "react";
import "./Tab.css";
import TabOne from "./TabContent/Tab1";
import TabTwo from "./TabContent/Tab2";
import UserComponent from "../user/UserComponent";
import PostComponent from "../post/PostComponent";

const Tabs = ({ posts, profile }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };

  // console.log(profile.bookedPost);

  return (
    <div className='tab_container'>
      <div className='Tabs'>
        {/* Tab nav */}
        <ul className='nav'>
          <li
            className={
              activeTab === "tab1" ? "list_item active_tab" : "list_item"
            }
            onClick={handleTab1}>
            Post
          </li>

          <li
            className={
              activeTab === "tab2" ? "list_item active_tab" : "list_item"
            }
            onClick={handleTab2}>
            Save
          </li>
        </ul>
        <div className='outlet'>
          {activeTab === "tab1" ? (
            <>
              {(posts || []).length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostComponent key={post._id} postData={post} />
                  ))}
                </>
              ) : (
                <span>No post available</span>
              )}
            </>
          ) : (
            <>
              {(profile.bookedPost || []).length > 0 ? (
                <>
                  {(profile.bookedPost || []).length > 0 ? (
                    <>
                      {profile.bookedPost.map((post) => (
                        <PostComponent key={post._id} postData={post} />
                      ))}
                    </>
                  ) : (
                    <>Empty post</>
                  )}
                </>
              ) : (
                <span>No post available</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Tabs;
