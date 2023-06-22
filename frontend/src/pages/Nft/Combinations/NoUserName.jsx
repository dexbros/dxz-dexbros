/** @format */

import React from "react";
import timeDifference from "../../../utils/getCreateTime";
import {
  AiFillHeart,
  AiOutlineEye,
  AiFillCaretDown,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { BiCommentMinus } from "react-icons/bi";
import CustomPostFormModal from "../../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";

import CustomEdit from "../Edit/CustomEdit";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
// import * as htmlToImage from "html-to-image";
import domtoimage from "dom-to-image";

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

const NoUserName = ({ post, isNameVisible }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [customFilter, setCustomFilter] = React.useState({});
  const [customFont, setCustomFont] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [selectColor, setSelectColor] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [isNextPage, setIsNextPage] = React.useState(false);
  const [url, setUrl] = React.useState("");

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

  const handleClickColor = (data) => {
    if (selectColor === data) {
      setSelectColor("");
    } else {
      setSelectColor(data);
    }
  };

  const domRef = React.useRef(null);

  const convertIntoImage = () => {
    domtoimage
      .toPng(domRef.current)
      .then((dataUrl) => {
        setUrl(dataUrl);
        console.log(dataUrl);
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
                        className='nft_post_user_image'
                      />

                      {/* Name */}
                      <div className='nft_post_user_name'>
                        {post.u_fn} {post.u_ln}
                      </div>

                      {/* username */}
                      {/* <div className='nft_post_user_username'>@{post.u_dun}</div> */}

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
                          crossorigin='anonymous'
                        />
                      )}
                    </div>

                    {/* Footer */}
                    <div className='nft_post_footer'>
                      <button className='nft_post_footer_btn'>
                        <AiFillHeart />
                        <span className='nft_post_footer_btn_count'>
                          {post.l_c}
                        </span>
                      </button>

                      {/* Comment */}
                      <button className='nft_post_footer_btn'>
                        <BiCommentMinus />
                        <span className='nft_post_footer_btn_count'>
                          {post.c_c}
                        </span>
                      </button>
                    </div>

                    {/* Edit */}
                    {!isNextPage ? (
                      <>
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
                                    onClick={() =>
                                      setSelectColor("transparent")
                                    }>
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
                                  onChange={(e) => handleImageChange(e)}
                                />
                              </label>
                            </div>
                          </div>

                          {selectColor && (
                            <button
                              className='remove_color_btn'
                              onClick={() => setSelectColor("")}>
                              Remove color
                            </button>
                          )}

                          {prevImage && (
                            <button
                              className='remove_color_btn'
                              onClick={() => setPrevImage("")}>
                              Remove image
                            </button>
                          )}
                        </div>
                        <div className='next_button_section'>
                          <button
                            className='next_button'
                            onClick={() => setIsNextPage(true)}>
                            Next
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          className='next_button'
                          onClick={() => setIsNextPage(false)}>
                          Back
                        </button>

                        <button
                          className='next_button'
                          onClick={convertIntoImage}>
                          Next
                        </button>
                      </>
                    )}
                  </div>
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
      <p className='combination_section_title'>Without username</p>

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
            crossorigin='anonymous'
          />

          {/* Name */}
          <div className='nft_post_user_name'>
            {post.u_fn} {post.u_ln}
          </div>

          {/* username */}
          {/* <div className='nft_post_user_username'>@{post.u_dun}</div> */}

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
      </div>
    </div>
  );
};

export default NoUserName;
