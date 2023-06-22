/** @format */

import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  addGroupPost,
  updateGroupPost,
  deleteGroupPost,
  addPostComment,
  updatePostComment,
  deletePostComment,
  setUpdateGroup,
} from "../../redux/Group/group.actions";
import ModalPost from "../modal/MobilePostForm";
import { ReactComponent as AtTheRateIcon } from "../../Assets/Icons/atthe.svg";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import { AiOutlineClose } from "react-icons/ai";
import ModalComp from "../modal/ModalComp";
import { ImSpinner2 } from "react-icons/im";
import { useParams } from "react-router-dom";
import { MdCreate } from "react-icons/md";

const NormalForm = ({
  token,
  group,
  user,
  updateGroupPost,
  selectGroup,
  setUpdateGroup,
}) => {
  const { t } = useTranslation(["common"]);
  const { id } = useParams();

  const [content, setContent] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [image, setImage] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [gif, setGif] = React.useState("");
  const [openPostPrivacy, setOpenPostPrivacy] = React.useState(false);
  const [postPrivacy, setPostPrivacy] = React.useState("Public");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [cName, setCName] = React.useState("");
  const [isSlide, setIsSlide] = React.useState(false);
  const [typeOfPost, setTypeOfPost] = React.useState("np");

  React.useEffect(() => {
    if (!content.trim()) {
      if (!image) {
        setIsDisable(true);
      } else {
        setIsDisable(false);
      }
    } else {
      setIsDisable(false);
    }
  }, [content, image]);

  // *** Handle group post content
  const handleContentChange = (e) => {
    setContent(e.target.value.slice(0, 200));
  };

  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const closeImage = () => {
    setImage("");
    setImagePreview("");
  };

  // *** Handle file image change
  const handleFileChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  // *** Handle post privacy
  const handlePrivacySettings = (value) => {
    setPostPrivacy(value);
    setOpenPostPrivacy(false);
  };

  // *** Handle submit post
  const handleSubmit = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("image", image);
    formdata.append("content", content);
    formdata.append("gif", gif);
    formdata.append("user_id", user._id);
    formdata.append("user_fn", user.firstName);
    formdata.append("user_ln", user.lastName);
    formdata.append("user_DUN", user.handleUn);
    formdata.append("profilePic", user.profilePic);
    formdata.append("group_id", id);
    formdata.append("privacy", postPrivacy);
    formdata.append("post_type", typeOfPost);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/group/post/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setImage("");
        setContent("");
        setImgPrev("");
        setIsDisable(true);
        toast.error(result.msg);
        setWordCount(0);
        setVisibleMsg(false);
        setIsLoading(false);
        setUpdateGroup(result);
      })
      .catch((error) => {
        console.log("error", error);
        setImage("");
        setContent("");
        setImgPrev("");
        setIsDisable(true);
        setIsLoading(false);
      });
  };
  return (
    <div className='block_form_section'>
      {!isSlide ? (
        <div className='form_box'>
          <textarea
            className='post_form_textarea'
            placeholder={t("post_your_thought")}
            value={content}
            onChange={(e) => handleContentChange(e)}></textarea>

          <div className='form_icons_section'>
            <div className='icons_sections'>
              <label htmlFor='post_file' className='file_icon'>
                {/* <GrGallery /> */}
                <span class='icon-gallery'></span>
              </label>
              <input
                type='file'
                id='post_file'
                className='input_file'
                onChange={(e) => handleFileChange(e)}
              />

              {/* Emoji button */}
              <button
                onClick={() => setOpenEmoji((prev) => !prev)}
                className='icons_button'>
                <span class='icon-emogy'></span>
              </button>

              {/* Post privacy */}
              <button
                className='modal_post_type_button'
                onClick={() => setOpenPostPrivacy(true)}>
                {postPrivacy}
              </button>
            </div>
            {!isDisable && (
              <button className='post_btn' onClick={() => setIsSlide(true)}>
                {isLoading ? (
                  <ImSpinner2 className='spinner' />
                ) : (
                  <>{t("post")}</>
                )}
              </button>
            )}
          </div>
          <div className='paid_section'>
            {/* post modal checkbox */}
            <div className='post_modal_checkbox_section'>
              <label className='checkbox_label'>
                <input
                  type='checkbox'
                  className='input_checkbox'
                  checked={check}
                  onChange={() => setCheck((prev) => !prev)}
                />
                Is this a paid promotion?
              </label>
              <br />
              {check && (
                <div className='check_area_input'>
                  <input
                    type='text'
                    className='check_text_input'
                    placeholder='Enter company name'
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                  />
                  <AtTheRateIcon className='attheRate_icon' />
                </div>
              )}
            </div>

            {/* Image preview container */}
            {imagePreview && (
              <div className='image_prev_section'>
                <img src={imagePreview} className='preview_image' />
                <button className='image_close_btn' onClick={closeImage}>
                  <AiOutlineClose />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='modal_slide_container'>
          <div className='post_form_radio_section'>
            <span className='post_catagory_header'>{t("post_type")}</span>
            {/* Select Radio */}
            <div className='post_form_radio_container'>
              <span className='radio_form'>
                {/* Normal post */}
                <label className='radio_label_text'>
                  <input
                    type='radio'
                    value={typeOfPost}
                    checked={typeOfPost === "np"}
                    onChange={() => setTypeOfPost("np")}
                  />
                  {t("Normal_post")}
                </label>
              </span>

              {/* News */}
              <span className='radio_form'>
                <label className='radio_label_text'>
                  <input
                    type='radio'
                    value={typeOfPost}
                    checked={typeOfPost === "news"}
                    onChange={() => setTypeOfPost("news")}
                  />
                  {t("News")}
                </label>
              </span>

              {/* Announcement */}
              <span className='radio_form'>
                <label className='radio_label_text'>
                  <input
                    type='radio'
                    value={typeOfPost}
                    checked={typeOfPost === "anc"}
                    onChange={() => setTypeOfPost("anc")}
                  />
                  {t("Announcement")}
                </label>
              </span>

              {/* Information or Educational */}
              <span className='radio_form'>
                <label className='radio_label_text'>
                  <input
                    type='radio'
                    value={typeOfPost}
                    checked={typeOfPost === "info"}
                    onChange={() => setTypeOfPost("info")}
                  />
                  {t("Information")}
                </label>
              </span>
              {/* Post Button */}
              <div className='post_button_container'>
                <button
                  className={"social_post_btn color-11"}
                  onClick={() => setIsSlide(false)}>
                  Go back
                </button>
                <button
                  className={"social_post_btn color-3"}
                  onClick={handleSubmit}>
                  {isLoading ? (
                    <ImSpinner2 className='spinner' />
                  ) : (
                    <>{t("post")}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state) => ({
  updatePost: state.group.updatePost,
  selectGroup: state.group.selectGroup,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  addGroupPost: (data) => dispatch(addGroupPost(data)),
  updateGroupPost: (data) => dispatch(updateGroupPost(data)),
  setUpdateGroup: (data) => dispatch(setUpdateGroup(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(NormalForm);
