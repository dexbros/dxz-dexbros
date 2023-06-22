/** @format */

import React from "react";
import { connect } from "react-redux";
import MainLayout from "../../layouts/main-layout.component";
import { setPageType } from "../../redux/page/page.actions";
import { BsCloudUpload } from "react-icons/bs";

const NFTForm = () => {
  const [image, setImage] = React.useState("");
  const [prevImage, setPrevImage] = React.useState("");
  const [name, setName] = React.useState("");
  const [nameCount, setNameCount] = React.useState(0);

  const [desc, setDesc] = React.useState("");
  const [descCount, setDescCount] = React.useState(0);

  const [walletAdd, setWalletAdd] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);

  React.useLayoutEffect(() => {
    setPageType("create_nft");
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setPrevImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleTitleChange = (e) => {
    setName(e.target.value.slice(0, 50));
  };

  const handleNameKey = (e) => {
    if (e.keyCode === 8) {
      setNameCount((prev) => prev - 1);
    } else {
      setNameCount((prev) => prev + 1);
    }
  };

  const handleDescriptionChange = (e) => {
    setDesc(e.target.value.slice(0, 200));
  };

  const handleDescriptionKey = (e) => {
    if (e.keyCode === 8) {
      setDescCount((prev) => prev - 1);
    } else {
      setDescCount((prev) => prev + 1);
    }
  };

  const handleSubmitNft = () => {
    console.log("CLick");
  };

  return (
    <MainLayout title='Post nft'>
      <div
        className={
          prevImage
            ? "image_preview_section"
            : "no_image_preview_section image_preview_section"
        }>
        {prevImage ? (
          <img src={prevImage} className='preview_image' />
        ) : (
          <>
            <label htmlFor='nft_img'>
              <BsCloudUpload className='upload_icon' />
            </label>
            <input
              type='file'
              id='nft_img'
              className='file_input'
              onChange={handleFileChange}
            />
          </>
        )}
      </div>

      <div className='nft_form_container'>
        <label className='word_count'>{nameCount}/50</label>
        <input
          type='text'
          className='nft_file_input'
          value={name}
          onChange={handleTitleChange}
          placeholder='Enter title'
          onKeyDown={handleNameKey}
        />

        {/* Description */}
        <label className='word_count'>{descCount}/200</label>
        <textarea
          type='text'
          className='nft_file_textarea'
          value={desc}
          onChange={handleDescriptionChange}
          placeholder='Enter description'
          onKeyDown={handleDescriptionKey}
        />

        <input
          type='text'
          className='nft_file_input'
          placeholder='Enter wallet address'
        />

        <button
          className={
            isDisable
              ? "submit_nft_btn disable_submit_nft_btn"
              : "submit_nft_btn"
          }
          disabled={isDisable}
          onClick={handleSubmitNft}>
          Upload
        </button>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NFTForm);
