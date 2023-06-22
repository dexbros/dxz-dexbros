/** @format */

import React, { useState, useEffect } from "react";
import Layout from "../../layouts/main-layout.component";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import { Link } from "react-router-dom";
import "./Analytics.css";
import { setPageType } from "../../redux/page/page.actions";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";

const GroupPageAnalytics = ({ token, user, setPageType }) => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}/api/group/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setGroup(result.group);
      })
      .catch((error) => console.log("error", error));
  }, [id]);

  return (
    <Layout goBack={true} title={<HeaderTitle content={"Group Analytics"} />}>
      {group && (
        <>
          <div className='box'></div>
          <div className='box'>
            <span className='box_header'>Total Visitors: </span>
            <span>{group.visitors}</span>
          </div>
          <div className='box'>
            <p className='box_header'>
              Total Unique Visitors: {group.unique_v}
            </p>
          </div>

          <div className='box'>
            <p className='box_header'>Members Posts:</p>
            {group.members.map((member) => (
              <div className='visitor_card' key={member._id}>
                <Link
                  to={`/profile/${member._id}`}
                  className='profile_img_container'>
                  <img
                    src={member.profilePic ? member.profilePic : ""}
                    className='profile_image'
                  />
                </Link>
                <Link to={`/profile/${member._id}`} className='name'>
                  {member.displayFirstName
                    ? member.displayFirstName
                    : member.firstName}{" "}
                  {member.displayLastName
                    ? member.displayLastName
                    : member.lastName}
                </Link>
                <span className='totalviews'>
                  No of posts:{" "}
                  <span>
                    {
                      group.posts.filter(
                        (post) => post.author._id === member._id
                      ).length
                    }
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPageAnalytics);
