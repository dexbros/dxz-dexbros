/** @format */

import React from "react";
import { connect } from "react-redux";
import domtoimage from "dom-to-image";
import CustomEdit from "./Edit/CustomEdit";
import { BsCloudUpload } from "react-icons/bs";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router";

const ImageEditComp = ({ imgUrl, token }) => {
  const navigate = useNavigate();
  const [customFilter, setCustomFilter] = React.useState({});
  const [coverImg, setCoverImg] = React.useState("");
  const [imageModal, setImageModal] = React.useState(false);
  const [openBiscEdit, setOpenBiscEdit] = React.useState(false);
  const [openSettings2, setOpenSettings2] = React.useState(false);
  const [backgroundValue, setBackgroundValue] = React.useState("");
  const [blobData, setBlocbData] = React.useState({
    size: 9441,
    type: "image/png",
  });

  const slider = [
    { label: "Contrast", defaultValue: 100, field: "contrast" },
    { label: "Brightness", defaultValue: 100, field: "brightness" },
    { label: "Saturation", defaultValue: 100, field: "saturate" },
    { label: "Sepia", defaultValue: 0, field: "sepia" },
    { label: "Gray Scale", defaultValue: 0, field: "gray" },
  ];

  const backgroundColor = [
    "linear-gradient(to top, #505285 0%, #585e92 12%, #65689f 25%, #7474b0 37%, #7e7ebb 50%, #8389c7 62%, #9795d4 75%, #a2a1dc 87%, #b5aee4 100%)",
    "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
    "linear-gradient(to top, #1e3c72 0%, #1e3c72 1%, #2a5298 100%)",
  ];

  const handleOpenModal = (value) => {
    setBackgroundValue(value);
  };

  const saveImage = async () => {
    const imgBlob = await domtoimage.toBlob(document.getElementById("my-node"));
    console.log(imgBlob);
    // setBlocbData(imgBlob);
    window.saveAs(imgBlob, "my-node.png");
    navigate("/nft/form");
  };

  // const uploadImage = () => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("Authorization", "Bearer " + token);
  //   myHeaders.append("Content-Type", "application/json");

  //   var raw = JSON.stringify({
  //     nft_img: blobData,
  //   });

  //   var requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch("http://localhost:5000/api/posts/upload/nft/image", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log("error", error));
  // };

  return (
    <div>
      {imgUrl && (
        <div
          id='my-node'
          className={backgroundValue ? "full_view_nft_image" : ""}
          style={{ backgroundImage: `${backgroundValue}` }}>
          <img
            style={{
              filter: `contrast(${customFilter.contrast}%) brightness(${customFilter.brightness}%) saturate(${customFilter.saturate}%) saturate(${customFilter.saturate}%) sepia(${customFilter.sepia}%) grayScale(${customFilter.gray}%)`,
            }}
            src={imgUrl}
            className='generate_image'
            alt='My Component as an Image'
          />
        </div>
      )}

      <div className='edit_section'>
        <div className='basc_edit_section'>
          <div
            className='basic_edit_header'
            onClick={() => setOpenBiscEdit((prev) => !prev)}>
            Basic edit
          </div>
          {openBiscEdit && (
            <div className='basic_edit_settings'>
              {slider.map((value) => (
                <CustomEdit
                  customFilter={customFilter}
                  setCustomFilter={setCustomFilter}
                  key={value.field}
                  customValue={value}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className='basic_edit_header'
          onClick={() => setOpenSettings2((p) => !p)}>
          Add background image
        </div>

        {openSettings2 && (
          <div className='background_image_section'>
            {backgroundColor.map((value, index) => (
              <div
                key={index}
                style={{ backgroundImage: `${value}` }}
                onClick={(e) => handleOpenModal(value)}
                className={
                  coverImg ? `demo_background` : "demo_background_no_img"
                }>
                <img
                  style={{
                    filter: `contrast(${customFilter.contrast}%)     
                    brightness(${customFilter.brightness}%)
                    saturate(${customFilter.saturate}%)
                    saturate(${customFilter.saturate}%) 
                    sepia(${customFilter.sepia}%) 
                    grayScale(${customFilter.gray}%)`,
                  }}
                  src={imgUrl}
                  className='demo_generate_image'
                  alt='My Component as an Image'
                />
              </div>
            ))}
            <div className='custom_frame_container'>
              <BsCloudUpload />
              <br />
              <span>
                Create your custom <frame />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className='btn_section'>
        <button className='save_button' onClick={saveImage}>
          Download
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

export default connect(mapStateToProps, null)(ImageEditComp);
