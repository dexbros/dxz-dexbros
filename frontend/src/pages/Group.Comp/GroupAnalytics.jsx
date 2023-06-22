/** @format */

import React from "react";
import { connect } from "react-redux";
import { setPageType, setScrollAxis } from "../../redux/page/page.actions";
import MainLayout from "../../layouts/main-layout.component";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
} from "chart.js";
import { useParams } from "react-router-dom";
import { SiPostcss } from "react-icons/si";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  LineElement,
  ArcElement
);

ChartJS.register(ArcElement, Tooltip, Legend);

const GroupAnalytics = ({ block, setPageType, token }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [group, setGroup] = React.useState(null);
  const [members, setMembers] = React.useState(0);
  const [admins, setAdmins] = React.useState(0);
  const [bannedUser, setBannedUser] = React.useState(0);
  const [visitors, setVisitors] = React.useState(0);
  const [uVisitors, setUVisitors] = React.useState(0);
  const [events, setEvents] = React.useState(0);
  const [posts, setPosts] = React.useState(0);

  React.useLayoutEffect(() => {
    setPageType("block_analytics");
  });

  // Fetch block data
  React.useEffect(() => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/fetch/analytics/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setMembers(result.block.g_mem.length);
        setAdmins(result.block.admins.length);
        setBannedUser(result.block.banned.length);
        setVisitors(result.meta.visitors.length);
        setUVisitors([...new Set(result.meta.visitors)].length);
        setEvents(result.meta.events.length);
        setPosts(result.meta.posts.length);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  }, [id]);

  const data = {
    maintainAspectRatio: true,
    responsive: true,
    labels: [
      `Members: ${members}`,
      `Admins: ${admins}`,
      `Banned user: ${bannedUser}`,
      `Visitors: ${visitors}`,
      `Unique visitors: ${uVisitors}`,
      `Total posts: ${posts}`,
      `Total events: ${events}`,
    ],
    datasets: [
      {
        data: [members, admins, bannedUser, visitors, uVisitors, posts, events],
        backgroundColor: [
          "rgba(240, 147, 43, 0.7)",
          "rgba(34, 166, 179, 0.7)",
          "rgba(19, 15, 64, 0.7)",
          "rgba(235, 77, 75, 0.7)",
          "rgba(106, 176, 76, 0.7)",
          "rgba(47, 53, 66, 0.7)",
          "rgba(255, 99, 72, 0.7)",
        ],
        hoverBackgroundColor: [
          "rgba(240, 147, 43,1.0)",
          "rgba(34, 166, 179,1.0)",
          "rgba(19, 15, 64,1.0)",
          "rgba(235, 77, 75,1.0)",
          "rgba(106, 176, 76,1.0)",
          "rgba(47, 53, 66,1.0)",
          "rgba(255, 99, 72,1.0)",
        ],
      },
    ],
  };

  return (
    <MainLayout title='Analytics'>
      <Doughnut data={data} />

      <div className='analytics_count_container'>
        {/* Members */}
        <div className='count_box'>
          <span className='count_box_text'>{members}</span>
          <br />
          <span className='count_box_header'>Members</span>
        </div>

        {/* Admins */}
        <div className='count_box'>
          <span className='count_box_text'>{admins}</span>
          <br />
          <span className='count_box_header'>Admins</span>
        </div>

        {/* Banned user */}
        <div className='count_box'>
          <span className='count_box_text'>{bannedUser}</span>
          <br />
          <span className='count_box_header'>Banned user</span>
        </div>

        {/* Visitors */}
        <div className='count_box'>
          <span className='count_box_text'>{visitors}</span>
          <br />
          <span className='count_box_header'>No of visitors</span>
        </div>

        {/* Unique visitors */}
        <div className='count_box'>
          <span className='count_box_text'>{uVisitors}</span>
          <br />
          <span className='count_box_header'>No of unique visitors</span>
        </div>

        <div className='count_box'>
          <span className='count_box_text'>{events}</span>
          <br />
          <span className='count_box_header'>Total no of events</span>
        </div>

        <div className='count_box'>
          <span className='count_box_text'>{posts}</span>
          <br />
          <span className='count_box_header'>Total no of posts</span>
        </div>
      </div>
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  block: state.group.selectGroup,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupAnalytics);
