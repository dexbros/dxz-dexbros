/** @format */

import React from "react";
import { connect } from "react-redux";
import { useSocket } from "../../socket/socket";
import { useTranslation } from "react-i18next";
import { setPageType } from "../../redux/page/page.actions";
import axios from "axios";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/main-layout.component";

import html2canvas from "html2canvas";

import domtoimage from "dom-to-image";
import NftPostSkeleton from "../../components/SkeletonLoading/NftPostSkeleton";
import NoName from "./Combinations/NoName";
import NoUserName from "./Combinations/NoUserName";
import NoContent from "./Combinations/NoContent";
import OnlyContent from "./Combinations/OnlyContent";
import WithoutFooter from "./Combinations/WithoutFooter";
import WithoutUserInfo from "./Combinations/WithoutUserInfo";
import WithComment from "./Combinations/WithComment";
import WithoutCommentUser from "./Combinations/WithoutCommentUser";
import Custom from "./Combinations/Custom";

const MainPage = ({ user, token, setPageType }) => {
  const { id } = useParams();
  const [post, setPost] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [comment, setComment] = React.useState(null);
  const [isFooterVisible, setIsFooterVisible] = React.useState(true);
  const [isCommentVisible, setIsCommentVisible] = React.useState(true);
  const [imgUrl, setImgUrl] = React.useState(null);
  const [isCustomVisible, setIsCustomVisible] = React.useState(false);
  const componentRef = React.useRef(null);

  // **** Name is not visible
  const [isNameVisible, setIsNameVisible] = React.useState(true);

  // name is selected
  const [isNameSelect, setIsNameSelect] = React.useState(false);
  // username is selected
  const [isUsernameSelect, setIsUsernameSelect] = React.useState(false);

  React.useLayoutEffect(() => {
    setPageType("create_nft");
  }, []);

  // *** Fetch full post
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_LINK}api/posts/fetch/nft/post/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res.data);
        setPost(res.data.post);
        setComment(res.data.comment || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, user, id]);

  const handleVisibleFooter = (value) => {
    console.log(value);
    setIsFooterVisible((p) => !p);
  };

  const handleVisibleComment = (value) => {
    console.log(value);
    setIsCommentVisible((p) => !p);
  };

  const handleClick = () => {
    html2canvas(componentRef.current)
      .then((canvas) => {
        console.log(canvas);
        setImgUrl(canvas.toDataURL());
      })
      .catch((error) => {
        console.error("Failed to generate image", error);
      });
  };

  function captureComponentImage(component) {
    domtoimage
      .toPng(component.current)
      .then(function (dataUrl) {
        console.log(dataUrl);
        setImgUrl(dataUrl);
        // var img = new Image();
        // img.src = dataUrl;
        // document.body.appendChild(img);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  return (
    <MainLayout title='Create nft'>
      {isLoading ? (
        <NftPostSkeleton />
      ) : (
        <>
          {post ? (
            <div className='ceate_nft_page'>
              <NoName isNameVisible={false} post={post} token={token} />
              <NoUserName post={post} />
              {post.image && <NoContent post={post} />}
              {post.content && <OnlyContent post={post} />}
              <WithoutFooter post={post} />
              <WithoutUserInfo post={post} />
              {comment && <WithComment post={post} comment={comment} />}
              {comment && <WithoutCommentUser post={post} comment={comment} />}
              <Custom post={post} comment={comment} />
            </div>
          ) : (
            <div className='empty_nft_post'>No post found</div>
          )}
        </>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);

// `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${postData.u_img}`
