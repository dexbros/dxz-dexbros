/** @format */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
// import timeDifference from "../../utils/getCreateTime";
// import intToString from "../../utils/PostCount";
import axios from "axios";
import { setPageType } from "../../redux/page/page.actions";
// import EarningAnalytics from "./EarningAnalytics";
// import OverAllAnalytics from "./OverAllAnalytics";
import OverallPostAnalytics from "./OverallPostAnalytics";
import EarningAnalytics from "../post-analytics/EarningAnalytics";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  LineElement
);

const GroupAnalyticspage = ({ token }) => {
  const { id } = useParams();
  const [likes, setLikes] = React.useState(0);
  const [shares, setShares] = React.useState(0);
  const [comments, setCommnents] = React.useState(0);
  const [select, setSelect] = React.useState("daily");
  const [openTimeModal, setOpenTimeModal] = React.useState(false);
  const [openMonthList, setOpenMonthList] = React.useState(false);
  const [selectMonth, setSelectMonth] = useState("");
  const [flwrIncr, setFlwrIncr] = React.useState(0);
  const [mode, setMode] = React.useState("overall");
  const [post, setPost] = React.useState(null);
  const [analyticsData, setAnalyticsData] = React.useState(null);

  React.useLayoutEffect(() => {
    setPageType("post_analytics");
  });

  useEffect(() => {
    const date = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;

    axios
      .get(
        `${process.env.REACT_APP_URL_LINK}api/group/post/fetch/analytics/${id}?date=${date}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log(res.data);
        setPost(res.data.metaData.bins);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, id, select]);

  return (
    <MainLayout goBack={true} title={"Analytics"}>
      {post && (
        <React.Fragment>
          {/* Tab */}
          <div className='post_analytics_tab'>
            <li
              className={
                mode === "overall"
                  ? "post_analytics_main_tab active_post_analytics_main_tab"
                  : "post_analytics_main_tab"
              }
              onClick={() => setMode("overall")}>
              Statistics
            </li>
            <li
              className={
                mode === "earning"
                  ? "post_analytics_main_tab active_post_analytics_main_tab"
                  : "post_analytics_main_tab"
              }
              onClick={() => setMode("earning")}>
              Earning
            </li>
          </div>

          {mode === "overall" ? (
            <OverallPostAnalytics post={post} />
          ) : (
            <EarningAnalytics post={post} />
          )}
        </React.Fragment>
      )}
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (type) => dispatch(setPageType(type)),
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAnalyticspage);
