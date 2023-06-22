/** @format */

import React from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import Layout from "../../layouts/main-layout.component";
import Test from "../../components/Group.Post.component/Test";

const GroupFullPost = ({ token, setPageType }) => {
  const { id } = useParams();
  const [post, setPost] = React.useState(null);

  React.useLayoutEffect(() => {
    setPageType("block_full_post");
  }, []);

  React.useEffect(() => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/group/post//view/full/post/${id}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        setPost(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);
  return (
    <Layout title='Full post'>
      {post ? <Test postData={post} /> : <>Loading</>}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  notifications: state.notification.notifications,
});
const mapDispatchToProps = (dispatch) => ({
  setPageType: (type) => dispatch(setPageType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupFullPost);
