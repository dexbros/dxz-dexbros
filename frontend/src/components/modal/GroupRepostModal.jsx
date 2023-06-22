import React from 'react';
import { AiOutlineClose } from "react-icons/ai";
import "./Modal.css";
import { Link } from "react-router-dom";
import { IoEarth } from "react-icons/io5";
import { CgUser } from "react-icons/cg";
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import Tooltip from '../Tooltip/Tooltip';
import timeDifference from "../../utils/getCreateTime";

const GroupRepostModl = ({ title, setIsClose, btnText, setPrevImg, selectedPost, token, handleRepostWithQuoteHandler, text, setText }) => {
  console.log(selectedPost)

  const closeModal = () => {
    setIsClose(false);
    if (setPrevImg) {
      setPrevImg('')
    }
  }

  const handleRepostInput = (e) => {
    setText(e.target.value.slice(0, 20))
  }

  return (
    <>
      {
        selectedPost &&
        <div className='__modal_overlay'>
          <div className='__modal'>
            <div className='__modal_header'>
              <span className='modal_header_text'>{title}</span>
              <button className="_modal_delete_close_btn">
                <AiOutlineClose className="_modal_close_btn" onClick={closeModal} />
              </button>
            </div>
            {/* Modal Body */}
            <div className='__group_modal_body'>
              <span className='input_label'>0/20</span><br />
              <input
                className='modal_input_field'
                type="text"
                placeholder='Share this post with your thought'
                value={text}
                onChange={e => handleRepostInput(e)}
              />

              {/* Original post */}
              <div className='group_post_container'>
                <div className='group_post_container_header'>
                  <div className='group_post_author_image'>
                    <img
                      src={
                        selectedPost.author.profilePic
                          ? selectedPost.author.profilePic
                          : Image
                      }
                      alt="group_User's profile"
                      className='group_author_profile_img'
                    />
                  </div>
                  
                  <div>
                    <div className='group_autho_info_one'>
                      <Link
                        className='group_post_author_name'
                        to={`/user/profile/${selectedPost.author.handleUn}`}>
                        {selectedPost.author.displayFirstName &&
                          selectedPost.author.displayLastName ? (
                          <>
                            {selectedPost.author.displayFirstName +
                              " " +
                              selectedPost.author.displayLastName}
                          </>
                        ) : (
                          <>
                            {selectedPost.author.firstName +
                              " " +
                              selectedPost.author.lastName}
                          </>
                        )}
                      </Link>
                      <span className='group_post_username'>@
                        {selectedPost.author.handleUn
                          ? selectedPost.author.handleUn
                          : selectedPost.author.username}
                      </span>
                      {/* post time */}
                      <span className='group_post_date'>
                        {timeDifference(new Date(), new Date(selectedPost.createdAt))}
                      </span>
                    </div>
                    <div className='group_autho_info_two'>
                      <p><IoEarth className="group_card_location_icon" />
                        <span className="group_card_location_city">{selectedPost.author.city}</span>, {" "}
                        <span className="group_card_location_city">{selectedPost.author.country}</span>
                      </p>
                        
                      <p><CgUser className="group_card_location_icon group_bio_icon" />
                        <span className="group_card_location_city">{selectedPost.author.bio}</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className='group_repost_modal_body'>
                  <div className='group_modal_content'>{selectedPost.content}</div>
                  
                  {/* Link */}
                  {
                    selectedPost.url !== '' ?
                      <div className="linkPreview">
                        <LinkPreview url={selectedPost.url} height="270px" description="null" />
                      </div> : null
                    }
                    {
                          selectedPost.image &&
                          <div className='post_card_image_container'>
                            <img src={selectedPost.image} className='post_card_image' />
                          </div>
                        }

                        {
                          selectedPost.gif &&
                          <div className='post_card_image_container'>
                            <img src={selectedPost.gif} className='post_card_image' />
                          </div>
                        }
                </div>
              </div>

            </div>
            {/* Modal Footer */}
            <div className='__group_modal_footer'>
              <button className='__group_close' onClick={closeModal}>Close</button>
              <button className="__group_pin" onClick={handleRepostWithQuoteHandler}>{btnText}</button>
            </div>
            {selectedPost._id}
          </div>
        </div>
      }
    </>
  )
};

export default GroupRepostModl