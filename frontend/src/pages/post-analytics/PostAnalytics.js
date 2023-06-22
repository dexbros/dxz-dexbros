/** @format */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";
import { userLogin } from "../../redux/user/user.actions";
import timeDifference from "../../utils/getCreateTime";
import intToString from "../../utils/PostCount";
import axios from "axios";
import "./Post.css";
import UserComponent from "../../components/user/UserComponent";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import EarningAnalytics from "./EarningAnalytics";
import OverAllAnalytics from "./OverAllAnalytics";

import { setPageType } from "../../redux/_page/pageSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchPostAnalytics } from "../../redux/_post/postSlice";
import { selectToken } from "../../redux/_user/userSelectors";

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

const PostAnalytics = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const isToken = useSelector(selectToken);
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

  const data = {
    labels: [`Post analytics`],
    datasets: [
      {
        label: [`Reaction: ${likes}`],
        data: [likes],
        borderRadius: 5,
        borderWidth: 2,
        backgroundColor: ["rgba(235, 77, 75, 0.4)"],
        borderColor: ["rgba(235, 77, 75,1.0)"],
      },

      {
        label: [`Shares: ${shares}`],
        data: [shares],
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: ["rgba(72, 52, 212, 0.4)"],
        borderColor: ["rgba(72, 52, 212,1.0)"],
      },

      {
        label: [`Follower gain ${flwrIncr}`],
        data: [flwrIncr],
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: ["rgba(47, 53, 66, 0.4)"],
        borderColor: ["rgba(47, 53, 66,1.0)"],
      },

      {
        label: [`Comments: ${comments}`],
        data: [comments],
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: ["rgba(46, 213, 115, 0.4)"],
        borderColor: ["rgba(46, 213, 115,1.0)"],
      },

      {
        label: [`Enganement ${likes + comments + shares}`],
        data: [likes + comments + shares],
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: ["rgba(47, 53, 66, 0.4)"],
        borderColor: ["rgba(47, 53, 66,1.0)"],
      },
    ],
  };

  React.useLayoutEffect(() => {
    dispatch(setPageType("post_analytics"));
  });

  useEffect(async () => {
    // const date = `${new Date().getDate()}-${
    //   new Date().getMonth() + 1
    // }-${new Date().getFullYear()}`;

    // axios
    //   .get(
    //     `${process.env.REACT_APP_URL_LINK}api/posts/fetch/post/analytics/${id}?date=${date}`,
    //     {
    //       headers: { Authorization: "Bearer " + token },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //     setPost(res.data.metaData.bins);
    //     setAnalyticsData(res.data.analytics[1]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    (async function () {
      const data = { id, isToken };
      const post = await dispatch(fetchPostAnalytics(data));
    })();
  }, [isToken, id, select]);

  // /fetch/donate/history/:id

  const handleOpenModal = () => {
    setOpenTimeModal(true);
    setSelect("custom");
  };

  const handleSelectMonthly = () => {
    setSelect("monthly");
    setOpenMonthList(true);
  };

  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setOpenMonthList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const hansleSelectMonth = (value) => {
    setSelectMonth(months.findIndex(value));
    console.log(months.findIndex(value));
    setOpenMonthList(false);
  };

  // *** Fetch Top10 contributor
  React.useEffect(() => {}, []);

  return (
    <MainLayout goBack={true} title={"Analytics"}>
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

        {mode === "overall" ? <OverAllAnalytics /> : <EarningAnalytics />}
      </React.Fragment>
    </MainLayout>
  );
};

export default PostAnalytics;

// <OverAllAnalytics post={post} analyticsData={analyticsData} />
