/** @format */

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";

import AnalyticsLoader from "../../components/SkeletonLoading/AnalyticsLoader";
import { useSelector, useDispatch } from "react-redux";
import {
  selectLoading,
  selectToken,
  selectUserAnalytics,
  selectFollowing,
} from "../../redux/_user/userSelectors";
import { setPageType } from "../../redux/_page/pageSlice";
import { getProfileAnalytics } from "../../redux/_user/userSlice";
import OverallAnalytics from "./OverallAnalytics";

const TestAnalytics = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserAnalytics);
  const { handleUn } = useParams();
  const isLoading = useSelector(selectLoading);
  const [following, setFollowing] = React.useState(0);
  const [followers, setFollowers] = React.useState(0);
  const [posts, setPosts] = React.useState(0);
  const [visitors, setVisisitors] = React.useState(0);
  const [uniqueVisitors, setUniqueVisisitors] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("overall");
  // const [isLoading, setIsLoading] = React.useState(false);
  const isToken = useSelector(selectToken);

  const [selectTab, setSelectTab] = useState("all");

  React.useLayoutEffect(() => {
    dispatch(setPageType("post_analytics"));
  });

  React.useEffect(() => {
    if (activeTab === "overall") {
      const data = { handleUn, isToken };
      dispatch(getProfileAnalytics(data));
      setIsLoading(true);
      var axios = require("axios");

      var config = {
        method: "get",
        url: `${process.env.REACT_APP_URL_LINK}api/users/analytics/${handleUn}`,
        headers: {
          Authorization: "Bearer " + isToken,
        },
      };

      axios(config)
        .then(function (response) {
          console.log(response.data);
          // setProfile(response.data);
          // setFollowing(response.data.flw_c);
          // setFollowers(response.data.flwr_c);
          // // setPosts(response.data.posts.length || 0);
          // // setVisisitors(response.data.visitors || 0);
          // // setUniqueVisisitors(response.data.u_visitors.length);
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      console.log("Hold");
    }
  }, [activeTab]);

  const data = {
    maintainAspectRatio: true,
    responsive: true,
    labels: [
      `Following: ${following}`,
      `Followers: ${followers}`,
      `Posts: ${posts}`,
      `Visitors: ${visitors}`,
      `Unique visitors: ${uniqueVisitors}`,
    ],
    datasets: [
      {
        data: [following, followers, posts, visitors, uniqueVisitors],
        backgroundColor: [
          "rgba(255, 165, 2, 0.7)",
          "rgba(46, 213, 115, 0.7)",
          "rgba(55, 66, 250,  0.7)",
          "rgba(44, 44, 84, 0.7)",
          "rgba(52, 73, 94, 0.7)",
          "rgba(231, 76, 60, 0.7)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 165, 2,1.0)",
          "rgba(46, 213, 115,1.0)",
          "rgba(55, 66, 250,1.0)",
          "rgba(44, 44, 84,1.0)",
          "rgba(52, 73, 94,1.0)",
          "rgba(231, 76, 60,1.0)",
        ],
      },
    ],
  };

  return (
    <MainLayout goBack={true} title={"Profile analytics"}>
      {/* <Doughnut data={data} /> */}
      <div className='profile_analytics_page'>
        {isLoading ? (
          <AnalyticsLoader />
        ) : (
          <>
            {/* Analytics tab */}
            <div className='analytics_tab_section'>
              <div
                className={
                  selectTab === "all"
                    ? "analyitics_tab _select_analyitcs_tab"
                    : "analyitics_tab"
                }
                onClick={() => setSelectTab("all")}>
                Overall
              </div>

              <div
                className={
                  selectTab === "earn"
                    ? "analyitics_tab _select_analyitcs_tab"
                    : "analyitics_tab"
                }
                onClick={() => setSelectTab("earn")}>
                Earning
              </div>
            </div>

            {/* Analytics chart view */}
            {selectTab === "all" ? (
              <div className='analytics_overview_section'>
                <OverallAnalytics profile={profile} />
              </div>
            ) : (
              <div className='analytics_overview_section'>
                Earning Analytics
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default TestAnalytics;
//<Doughnut data={data} />
// profile.flw_c > 0 || profile.flwr_c > 0
