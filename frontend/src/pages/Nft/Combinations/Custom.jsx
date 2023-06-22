/** @format */
import React from "react";
import timeDifference from "../../../utils/getCreateTime";
import {
  AiFillHeart,
  AiOutlineEye,
  AiFillCaretDown,
  AiOutlinePlusCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { BiCommentMinus } from "react-icons/bi";
import CustomPostFormModal from "../../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
// import * as htmlToImage from "html-to-image";
import domtoimage from "dom-to-image";
import CustomEdit from "../Edit/CustomEdit";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const slider = [
  { label: "Contrast", defaultValue: 100, field: "contrast" },
  { label: "Brightness", defaultValue: 100, field: "brightness" },
  { label: "Saturation", defaultValue: 100, field: "saturate" },
  { label: "Sepia", defaultValue: 0, field: "sepia" },
  { label: "Gray Scale", defaultValue: 0, field: "gray" },
];

const fonts = [
  { label: "Consolas", value: "consolas" },
  { label: "Serif", value: "serif" },
  { label: "Cursive", value: "cursive" },
  { label: "Monospace", value: "monospace" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Normal", value: "normal" },
];

const colors = ["#2f3542", "#3742fa", "#2ed573", "#eb3b5a", "#fa8231"];

const WithoutCommentUser = ({ post, isNameVisible, comment }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [customFilter, setCustomFilter] = React.useState({});
  const [customFont, setCustomFont] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectColor, setSelectColor] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");

  // *** Name is not displayed
  const [isDisableProfileImg, setIsDisaplayProfileImg] = React.useState(true);
  const [isDisable, setIsDisaplay] = React.useState(true);
  const [isDisableUsername, setIsDisaplayUsername] = React.useState(true);
  const [isDisableTime, setIsDisableTime] = React.useState(true);
  const [isDisableContent, setIsDisableContent] = React.useState(true);

  const [isDisableLikeBtn, setIsDisableLikeBtn] = React.useState(true);
  const [isDisableCmntBtn, setIsDisableCmntBtn] = React.useState(true);
  const [isDisableCmntProfileImg, setIsDisableCmntProfileImg] =
    React.useState(true);
  const [isDisableCmntName, setIsDisableCmntName] = React.useState(true);
  const [isDisableCmntUsername, setIsDisableCmntUsername] =
    React.useState(true);
  const [isDisableCmntTime, setIsDisableCmntTime] = React.useState(true);
  const [isDisableCmntContent, setIsDisableCmntContent] = React.useState(true);

  const [isCmntDisable, setIsCmntDisable] = React.useState(true);
  const [url, setUrl] = React.useState("");
  const [isNextPage, setIsNextPage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFont = (value) => {
    if (value === "normal") {
      setCustomFont("");
    } else {
      setCustomFont(value);
    }
  };

  const handleImageChange = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  React.useEffect(() => {
    if (
      !isDisableCmntName &&
      !isDisableCmntUsername &&
      !isDisableCmntTime &&
      !isDisableCmntContent
    ) {
      setIsCmntDisable(false);
    } else {
      setIsCmntDisable(true);
    }
  }, [
    isDisableCmntName,
    isDisableCmntUsername,
    isDisableCmntTime,
    isDisableCmntContent,
  ]);

  const handleClickColor = (data) => {
    if (selectColor === data) {
      setSelectColor("");
    } else {
      setSelectColor(data);
    }
  };

  const domRef = document.querySelector(".nft_post_box");

  const convertIntoImage = () => {
    setLoading(true);
    domtoimage
      .toPng(domRef.current)
      .then((dataUrl) => {
        setUrl(dataUrl);
        setLoading(false);
        // console.log(dataUrl);
      })
      .catch((error) => {
        console.log("Image not created");
      });
  };

  return (
    <div className='combination_section'>
      {openModal && (
        <CustomPostFormModal
          onClose={() => setOpenModal(false)}
          title={
            <div className='preview_modal_title'>
              <button
                className='preview_modal_close_btn'
                onClick={() => setOpenModal(false)}>
                <BiArrowBack />{" "}
              </button>
              <span className='preview_modal_title_text'>Preview and Edit</span>
            </div>
          }
          body={
            <React.Fragment>
              {!url ? (
                <div className='edit_combination_post_section'>
                  {!isNextPage ? (
                    <div
                      className='nft_post_box'
                      ref={domRef}
                      style={{
                        filter: `contrast(${customFilter.contrast}%) brightness(${customFilter.brightness}%) saturate(${customFilter.saturate}%) saturate(${customFilter.saturate}%) sepia(${customFilter.sepia}%) grayScale(${customFilter.gray}%)`,
                        fontFamily: `${customFont}`,
                        backgroundColor: `${selectColor}`,
                        color:
                          selectColor === "#2f3542" ||
                          selectColor === "#3742fa" ||
                          selectColor === "#2ed573" ||
                          selectColor === "#eb3b5a"
                            ? "aliceblue"
                            : "black",
                      }}>
                      {/* Header */}
                      <div className='nft_post_header'>
                        {/* image */}
                        <img
                          src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.u_img}`}
                          onClick={() => setIsDisaplayProfileImg((p) => !p)}
                          className={
                            isDisableProfileImg
                              ? "nft_post_user_image"
                              : "nft_post_user_image line_through"
                          }
                        />

                        {/* Name */}
                        <div
                          className={
                            isDisable
                              ? "nft_post_user_name"
                              : "nft_post_user_name line_through"
                          }
                          onClick={() => setIsDisaplay((p) => !p)}>
                          {post.u_fn} {post.u_ln}
                        </div>

                        {/* username */}
                        <div
                          className={
                            isDisableUsername
                              ? "nft_post_user_username"
                              : "nft_post_user_username line_through"
                          }
                          onClick={() => setIsDisaplayUsername((p) => !p)}>
                          @{post.u_dun}
                        </div>

                        {/* Timestemps */}
                        <div
                          className={
                            isDisableTime
                              ? "nft_post_user_username"
                              : "nft_post_user_username line_through"
                          }
                          onClick={() => setIsDisableTime((p) => !p)}>
                          {timeDifference(
                            new Date().getTime(),
                            Number(post.c_t)
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className='nft_post_body'>
                        <p
                          className={
                            isDisableContent
                              ? "nft_post_content"
                              : "nft_post_content line_through"
                          }
                          onClick={() => setIsDisableContent((p) => !p)}>
                          {post.content}
                        </p>
                        {post.image && (
                          <img
                            src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.image}`}
                            className='combination_post_image'
                          />
                        )}
                      </div>

                      {/* Footer */}
                      <div className='nft_post_footer'>
                        <button
                          className={
                            isDisableLikeBtn
                              ? "nft_post_footer_btn"
                              : "nft_post_footer_btn blur_btn"
                          }
                          onClick={() => setIsDisableLikeBtn((p) => !p)}>
                          <AiFillHeart />
                          <span className='nft_post_footer_btn_count'>
                            {post.l_c}
                          </span>
                        </button>

                        {/* Comment */}
                        <button
                          className={
                            isDisableCmntBtn
                              ? "nft_post_footer_btn"
                              : "nft_post_footer_btn blur_btn"
                          }
                          onClick={() => setIsDisableCmntBtn((p) => !p)}>
                          <BiCommentMinus />
                          <span className='nft_post_footer_btn_count'>
                            {post.c_c}
                          </span>
                        </button>
                      </div>
                      {/* Comment Section */}
                      {comment && (
                        <div
                          className={
                            isCmntDisable
                              ? "combination_comment_section"
                              : "combination_comment_section blur_btn"
                          }>
                          {/* Header */}
                          <div className='combination_comment_header'>
                            <img
                              src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${comment.c_u_img}`}
                              alt=''
                              onClick={() =>
                                setIsDisableCmntProfileImg((p) => !p)
                              }
                              className={
                                isDisableCmntProfileImg
                                  ? "combination_comment_user_img"
                                  : "combination_comment_user_img line_through"
                              }
                            />

                            <span
                              className={
                                isDisableCmntName
                                  ? "combination_cmnt_user_name"
                                  : "combination_cmnt_user_name line_through"
                              }
                              onClick={() => setIsDisableCmntName((p) => !p)}>
                              {comment.c_fn} {comment.c_ln}
                            </span>

                            <span
                              className={
                                isDisableCmntUsername
                                  ? "combination_cmnt_user_username"
                                  : "combination_cmnt_user_username line_through"
                              }
                              onClick={() =>
                                setIsDisableCmntUsername((p) => !p)
                              }>
                              @{comment.c_u_du}
                            </span>

                            <span
                              className={
                                isDisableCmntTime
                                  ? "combination_cmnt_time"
                                  : "combination_cmnt_time line_through"
                              }
                              onClick={() => setIsDisableCmntTime((p) => !p)}>
                              {timeDifference(
                                new Date().getTime(),
                                Number(comment.c_t)
                              )}
                            </span>
                          </div>

                          {/* Body */}
                          <div
                            className={
                              isDisableCmntContent
                                ? "combination_comment_body"
                                : "combination_comment_body line_through"
                            }
                            onClick={() => setIsDisableCmntContent((p) => !p)}>
                            {comment.comment}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className='nft_post_box'
                      style={{
                        filter: `contrast(${customFilter.contrast}%) brightness(${customFilter.brightness}%) saturate(${customFilter.saturate}%) saturate(${customFilter.saturate}%) sepia(${customFilter.sepia}%) grayScale(${customFilter.gray}%)`,
                        fontFamily: `${customFont}`,
                        backgroundColor: `${selectColor}`,
                        color:
                          selectColor === "#2f3542" ||
                          selectColor === "#3742fa" ||
                          selectColor === "#2ed573" ||
                          selectColor === "#eb3b5a"
                            ? "aliceblue"
                            : "black",
                      }}>
                      {/* Header */}
                      <div className='nft_post_header'>
                        {/* image */}
                        {isDisableProfileImg && (
                          <img
                            src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.u_img}`}
                            onClick={() => setIsDisaplayProfileImg((p) => !p)}
                            className={
                              isDisableProfileImg
                                ? "nft_post_user_image"
                                : "nft_post_user_image line_through"
                            }
                          />
                        )}

                        {/* Name */}
                        {isDisable && (
                          <div
                            className={
                              isDisable
                                ? "nft_post_user_name"
                                : "nft_post_user_name line_through"
                            }
                            onClick={() => setIsDisaplay((p) => !p)}>
                            {post.u_fn} {post.u_ln}
                          </div>
                        )}

                        {/* username */}
                        {isDisableUsername && (
                          <div
                            className={
                              isDisableUsername
                                ? "nft_post_user_username"
                                : "nft_post_user_username line_through"
                            }
                            onClick={() => setIsDisaplayUsername((p) => !p)}>
                            @{post.u_dun}
                          </div>
                        )}

                        {/* Timestemps */}
                        {isDisableTime && (
                          <div
                            className={
                              isDisableTime
                                ? "nft_post_user_username"
                                : "nft_post_user_username line_through"
                            }
                            onClick={() => setIsDisableTime((p) => !p)}>
                            {timeDifference(
                              new Date().getTime(),
                              Number(post.c_t)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className='nft_post_body'>
                        {isDisableContent && (
                          <p
                            className={
                              isDisableContent
                                ? "nft_post_content"
                                : "nft_post_content line_through"
                            }
                            onClick={() => setIsDisableContent((p) => !p)}>
                            {post.content}
                          </p>
                        )}
                        {post.image && (
                          <img
                            src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.image}`}
                            className='combination_post_image'
                          />
                        )}
                      </div>

                      {/* Footer */}
                      <div className='nft_post_footer'>
                        {isDisableLikeBtn && (
                          <button
                            className={
                              isDisableLikeBtn
                                ? "nft_post_footer_btn"
                                : "nft_post_footer_btn blur_btn"
                            }
                            onClick={() => setIsDisableLikeBtn((p) => !p)}>
                            <AiFillHeart />
                            <span className='nft_post_footer_btn_count'>
                              {post.l_c}
                            </span>
                          </button>
                        )}

                        {/* Comment */}
                        {isDisableCmntBtn && (
                          <button
                            className={
                              isDisableCmntBtn
                                ? "nft_post_footer_btn"
                                : "nft_post_footer_btn blur_btn"
                            }
                            onClick={() => setIsDisableCmntBtn((p) => !p)}>
                            <BiCommentMinus />
                            <span className='nft_post_footer_btn_count'>
                              {post.c_c}
                            </span>
                          </button>
                        )}
                      </div>
                      {/* Comment Section */}
                      {comment && (
                        <React.Fragment>
                          {isCmntDisable && (
                            <div
                              className={
                                isCmntDisable
                                  ? "combination_comment_section"
                                  : "combination_comment_section blur_btn"
                              }>
                              {/* Header */}
                              <div className='combination_comment_header'>
                                {isDisableCmntProfileImg && (
                                  <img
                                    src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${comment.c_u_img}`}
                                    alt=''
                                    onClick={() =>
                                      setIsDisableCmntProfileImg((p) => !p)
                                    }
                                    className={
                                      isDisableCmntProfileImg
                                        ? "combination_comment_user_img"
                                        : "combination_comment_user_img line_through"
                                    }
                                  />
                                )}

                                {isDisableCmntName && (
                                  <span
                                    className={
                                      isDisableCmntName
                                        ? "combination_cmnt_user_name"
                                        : "combination_cmnt_user_name line_through"
                                    }
                                    onClick={() =>
                                      setIsDisableCmntName((p) => !p)
                                    }>
                                    {comment.c_fn} {comment.c_ln}
                                  </span>
                                )}

                                {isDisableCmntUsername && (
                                  <span
                                    className={
                                      isDisableCmntUsername
                                        ? "combination_cmnt_user_username"
                                        : "combination_cmnt_user_username line_through"
                                    }
                                    onClick={() =>
                                      setIsDisableCmntUsername((p) => !p)
                                    }>
                                    @{comment.c_u_du}
                                  </span>
                                )}

                                {isDisableCmntTime && (
                                  <span
                                    className={
                                      isDisableCmntTime
                                        ? "combination_cmnt_time"
                                        : "combination_cmnt_time line_through"
                                    }
                                    onClick={() =>
                                      setIsDisableCmntTime((p) => !p)
                                    }>
                                    {timeDifference(
                                      new Date().getTime(),
                                      Number(comment.c_t)
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Body */}
                              {isDisableCmntContent && (
                                <div
                                  className={
                                    isDisableCmntContent
                                      ? "combination_comment_body"
                                      : "combination_comment_body line_through"
                                  }
                                  onClick={() =>
                                    setIsDisableCmntContent((p) => !p)
                                  }>
                                  {comment.comment}
                                </div>
                              )}
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </div>
                  )}
                  {isNextPage ? (
                    <>
                      <button
                        className='next_button'
                        onClick={() => setIsNextPage(false)}>
                        Back
                      </button>

                      <button
                        className='next_button'
                        onClick={() => setIsNextPage(true)}>
                        Next
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit */}
                      <div className='modal_edit_section'>
                        <div className='basic_edit_settings'>
                          <div
                            className='edit_title'
                            onClick={() => setIsVisible((p) => !p)}>
                            Basic edit
                            <span>
                              <AiFillCaretDown className='down_icon' />
                            </span>
                          </div>

                          {isVisible && (
                            <>
                              {slider.map((value) => (
                                <CustomEdit
                                  customFilter={customFilter}
                                  setCustomFilter={setCustomFilter}
                                  key={value.field}
                                  customValue={value}
                                />
                              ))}

                              <div className='fonts_menu'>
                                <Menu
                                  menuButton={
                                    <MenuButton
                                      className={"modal_edit_menu_button"}>
                                      Select font
                                    </MenuButton>
                                  }>
                                  {fonts.map((data) => (
                                    <MenuItem
                                      id={data.value}
                                      className={"social_post_menu_item"}
                                      onClick={() => handleFont(data.value)}>
                                      {data.label}
                                    </MenuItem>
                                  ))}
                                </Menu>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className='custom_background'>
                        <div className='custom_background_title'>
                          Add background
                        </div>

                        <div className='colors_section'>
                          {colors.map((data, index) => (
                            <div
                              key={index}
                              onClick={() => handleClickColor(data)}
                              className='color_btn'
                              style={{ backgroundColor: data }}>
                              {selectColor === data ? (
                                <button
                                  onClick={() => setSelectColor("transparent")}>
                                  <AiOutlineCloseCircle className='close_color_btn' />
                                </button>
                              ) : null}
                            </div>
                          ))}
                          <div className='color_btn'>
                            <label htmlFor='nft_img'>
                              <AiOutlinePlusCircle className='img_file_upload' />
                              <input
                                type='file'
                                id='nft_img'
                                className='file_input'
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className='next_button_section'>
                        <button
                          className='next_button'
                          onClick={() => setIsNextPage(true)}>
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <img src={url} />
                  <>
                    <button className='next_button' onClick={() => setUrl("")}>
                      Back
                    </button>

                    <button className='next_button' onClick={convertIntoImage}>
                      Download
                    </button>
                  </>
                </div>
              )}
            </React.Fragment>
          }
        />
      )}
      <p className='combination_section_title'>Custom</p>
      <div className='combination_post_section'>
        {/* Overlay */}
        <div className='post_overlay' onClick={() => setOpenModal(true)}>
          <button className='overlay_text'>
            <AiOutlineEye className='overlay_eye_icon' />
            <span className='overlay_view_btn'>View</span>
          </button>
        </div>
        {/* Header */}
        <div className='nft_post_header'>
          {/* image */}
          <img
            src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.u_img}`}
            className='nft_post_user_image'
          />

          {/* Name */}
          <div className='nft_post_user_name'>
            {post.u_fn} {post.u_ln}
          </div>

          {/* username */}
          <div className='nft_post_user_username'>@{post.u_dun}</div>

          {/* Timestemps */}
          <div className='nft_post_timestamps'>
            {timeDifference(new Date().getTime(), Number(post.c_t))}
          </div>
        </div>

        {/* Body */}
        <div className='nft_post_body'>
          <p className='nft_post_content'>{post.content}</p>
          {post.image && (
            <img
              src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${post.image}`}
              className='combination_post_image'
            />
          )}
        </div>

        {/* Footer */}
        <div className='nft_post_footer'>
          <button className='nft_post_footer_btn'>
            <AiFillHeart />
            <span className='nft_post_footer_btn_count'>{post.l_c}</span>
          </button>

          {/* Comment */}
          <button className='nft_post_footer_btn'>
            <BiCommentMinus />
            <span className='nft_post_footer_btn_count'>{post.c_c}</span>
          </button>
        </div>

        {/* Comment Section */}
        {comment && (
          <div className='combination_comment_section'>
            {/* Header */}
            <div className='combination_comment_header'>
              <img
                src={`${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${comment.c_u_img}`}
                alt=''
                className='combination_comment_user_img'
              />

              <span className='combination_cmnt_user_name'>
                {comment.c_fn} {comment.c_ln}
              </span>

              <span className='combination_cmnt_user_username'>
                @{comment.c_u_du}
              </span>

              <span className='combination_cmnt_time'>
                {timeDifference(new Date().getTime(), Number(comment.c_t))}
              </span>
            </div>

            {/* Body */}
            <div className='combination_comment_body'>{comment.comment}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithoutCommentUser;
