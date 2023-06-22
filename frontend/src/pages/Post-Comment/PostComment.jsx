/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { setPageType } from "../../redux/page/page.actions";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { userLogin } from "../../redux/user/user.actions";
import MainLayout from "../../layouts/main-layout.component";
import axios from "axios";
// import PostCommentComp from '../../components/postComment/PostComment';
import { useState } from "react";
import "./PostComment.css";
import {
  setNewPinnedPost,
  updatePost,
  deletePost,
  putPosts,
  newPosts,
} from "../../redux/post/post.actions";
import { useEffect } from "react";

const PostComment = ({ token, user, login, setPageType, setPinnedPost }) => {
  const { id } = useParams();
  const [posts, setPosts] = useState(null);
  const [config, setConfig] = useState(null);
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [openGifModal, setOpenGifModal] = useState(false);
  const [gif, setGif] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const [image, setImage] = useState("");
  const [openStickerModal, setOpenStickerModal] = useState(false);
  const [sticker, setSticker] = useState("");
  const [isDisable, setIsDisable] = useState("");

  // Fetching config file
  React.useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5000/post/config", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setConfig(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  React.useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        // setPostData(res.data);
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleInputField = (e) => {
    const limit = 20;
    setValue(e.target.value.slice(0, limit - 1));
    setCount(e.target.value.length);
  };

  const addEmoji = (e) => {
    setValue((prev) => prev + e.native);
  };

  const closePreviewImage = () => {
    setPrevImage("");
  };

  const handleFileChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (!value.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [value]);

  return (
    <MainLayout goBack={true} title={<HeaderTitle content={"Post comments"} />}>
      {posts ? <></> : <>Loading</>}
    </MainLayout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostComment);
