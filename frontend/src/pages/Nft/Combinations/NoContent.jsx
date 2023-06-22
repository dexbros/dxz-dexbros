/** @format */

import React from "react";
import timeDifference from "../../../utils/getCreateTime";
import { AiFillHeart, AiOutlineEye } from "react-icons/ai";
import { BiCommentMinus } from "react-icons/bi";
import CustomPostFormModal from "../../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";

const NoUserName = ({ post, isNameVisible }) => {
  const [openModal, setOpenModal] = React.useState(false);
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
            <div className='combination_post_section'>
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
                {/* <p className='nft_post_content'>{post.content}</p> */}
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
          }
        />
      )}
      <p className='combination_section_title'>Only post image</p>

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
          {/* <p className='nft_post_content'>{post.content}</p> */}
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
