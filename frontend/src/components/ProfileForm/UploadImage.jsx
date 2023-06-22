/** @format */

import React from "react";

import { ImSpinner2 } from "react-icons/im";
import { userLogin } from "../../redux/user/user.actions";
import {
  AiOutlineCloudUpload,
  AiOutlineClose,
  AiFillCheckCircle,
} from "react-icons/ai";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { updateUserState } from "../../redux/_user/userSlice";
import { useTranslation } from "react-i18next";
import {
  updateProfileImage,
  handleUpdateUserDetails,
} from "../../redux/_user/userSlice";

const ProfileImage = ({ setStep, token, user, login, setOpenFormModal }) => {
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const { t } = useTranslation(["common"]);
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [formData, setFormData] = React.useState({
    prompt: "",
    negative_prompt: null,
    width: "120",
    height: "120",
    samples: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrls, setImageUrls] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(true);
  const [selectUrl, setSelectUrl] = React.useState("");
  const [isDisableBtn, setIsDisableBtn] = React.useState(true);
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);

  const handleUploadImage = (e) => {
    setPrevImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const closeImagePreview = () => {
    setPrevImage("");
    setImage("");
    setSelectUrl("");
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  React.useEffect(() => {
    if (!formData.prompt.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [formData.prompt]);

  const generateImages = () => {
    setIsLoading(true);
    setIsDisable(true);
    setFormData({
      prompt: "",
      negative_prompt: null,
      width: "120",
      height: "120",
      samples: "",
    });
    axios
      .post("http://websiteclubs.com:3300/ai/image-generation", formData)
      .then((response) => {
        setImageUrls(response.data.data.response.output);
        setIsLoading(false);
      })
      .catch((Error) => {
        console.log("Error: ", Error);
      });
  };

  const handleSelectImage = (url) => {
    setSelectUrl(url);
    setPrevImage(url);
  };

  React.useEffect(() => {
    if (!prevImage.trim()) {
      setIsDisableBtn(true);
    } else {
      setIsDisableBtn(false);
    }
  }, [prevImage]);

  const handleProfileImage = async () => {
    if (selectUrl) {
      setIsBtnLoading(true);
      //
      const axios = require("axios");
      let data = JSON.stringify({
        url: selectUrl,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.REACT_APP_URL_LINK}api/users/update/avatar`,
        headers: {
          Authorization: "Bearer " + isToken,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response.data);
          login(response.data.user, response.data.token);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const data = { profileImg: image, isToken };
      await dispatch(updateProfileImage(data));
      try {
        setIsDisableBtn(true);
        setPrevImage("");
        setImage("");
      } catch (error) {
        console.log("Error");
      }
    }
  };

  const handleUpdateUser = () => {
    const data = { isToken, handleUn: isUser.handleUn };
    dispatch(handleUpdateUserDetails(data));
  };

  return (
    <div className='profilePicture_upload_modal'>
      <div className='upload_image_modal_section'>
        <span className='modal_upload_image_header'>
          {t("Upload profile image")}
        </span>

        <div className='upload_container_one'>
          {prevImage ? (
            <div className='modal_prev_image'>
              <img src={prevImage} className='prev_image' />
              <button className='close_btn' onClick={closeImagePreview}>
                <AiOutlineClose />
              </button>
            </div>
          ) : (
            <label htmlFor='modal_image' className='modal_image_label'>
              <AiOutlineCloudUpload className='modal_image_upload_icons' />
              <input
                type='file'
                id='modal_image'
                className='file_input'
                onChange={(e) => handleUploadImage(e)}
              />
            </label>
          )}
        </div>

        {/* Divider */}
        <div class='__divider'>OR</div>

        {/* Promt section */}
        <div className='prompt_form_section'>
          <input
            type='text'
            name='prompt'
            placeholder='Enter prompt to generate image'
            className='prompt_modal_input'
            value={formData.prompt}
            onChange={(e) => handleChange(e)}
          />
          {isDisable ? (
            <button className='disable_modal_btn'>
              {t("Generate images")}
            </button>
          ) : (
            <button className='image_generate_btn' onClick={generateImages}>
              {t("Generate images")}
            </button>
          )}
        </div>

        {/* Rendering images */}
        <div className='rendering_image_section'>
          {isLoading ? (
            <>Loading</>
          ) : (
            <>
              {(imageUrls || []).length > 0 ? (
                <div className='generate_prev_image_section'>
                  {imageUrls.map((data, index) => (
                    <div key={index} className='generated_image_section'>
                      {selectUrl === data && (
                        <AiFillCheckCircle className='select_icon' />
                      )}
                      <img
                        src={data}
                        className='generate_img_preview'
                        onClick={() => handleSelectImage(data)}
                      />
                      {data}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='generate_empty_preview_image'>
                  {t("No preview image found")}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {isDisableBtn ? (
        <button
          className='profilePicture_upload_modal_btn'
          onClick={handleUpdateUser}>
          Close
        </button>
      ) : (
        <button
          className='profilePicture_upload_modal_btn image_upload_button'
          onClick={handleProfileImage}>
          Update
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default ProfileImage;
