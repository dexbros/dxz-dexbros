import React from 'react';
import Layout from "../../layouts/main-layout.component";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../redux/page/page.actions";
import { userLogin, updateUser } from "../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import { AiFillCaretDown, AiOutlineCaretUp, AiOutlineClose } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import UserAvatar from "../../Assets/userAvatar.webp";
import ModalComp from '../../components/modal/ModalComp';
import { BsCloudUpload } from "react-icons/bs";
const hobyLists = ['Cricket', 'Football', 'Crypto', 'Photography', 'Treading'];
import CountryData from "../../data/country.json"

const PersonalEdit = ({ user, token, update, setUpdatedUser, profile }) => {
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const [openProfilePicModal, setOpenProfilePicModal] = React.useState(false);
  const [openProfilePCoverModal, setOpenProfileCoverModal] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [coverImg, setCoverImg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileImg, setProfileImage] = React.useState("");
  const [isBioOpen, setIsBioOpen] = React.useState(false);
  const [isHobbiesOpen, setIsHobbiesOpen] = React.useState(false);
  const [isOpenIntro, setIsOpenIntro] = React.useState(false);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [displayfirstName, setDisplayFirstName] = React.useState("");
  const [displaylastName, setDisplayLastName] = React.useState("");
  const [bio, setBio] = React.useState(user.p_bio);
  
  const [list, setList] = React.useState("");
  const [intesrests, setInterests] = React.useState([]);
  const [hobbies, setHobbies] = React.useState([]);
  const [work, setWork] = React.useState("");
  const [showWork, setShowWork] = React.useState(false);
  const [school, setSchool] = React.useState("");
  const [showSchool, setShowSchool] = React.useState(false);
  const [education, setEducation] = React.useState("");
  const [university, setUniversity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [showCountry, setShowCountry] = React.useState(false);
  const [city, setCity] = React.useState("");
  const [showCity, setShowCity] = React.useState(false);
  const [links, setLinks] = React.useState("");
  const [countryList, setCountryList] = React.useState([]);
  const [cityList, setCityList] = React.useState([]);
  const [isOpenBasicInfo, setIsOpenBasicInfo] = React.useState(false);
  const [gender, setGender] = React.useState(user.gender ? user.gender : "")

  // *** Handle profile image input file change handler
  const handleProfileImageChange = (e) => {
    console.log(e.target.files[0])
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setProfileImage(e.target.files[0]);
  }
  // *** Uploading profile image
  const handleProfileImage = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();
    formdata.append("profilePicture", profileImg);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch("http://localhost:5000/api/users/profile/image", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result.user);
        setUpdatedUser(result.user)
        setIsLoading(false);
        setPreviewImage("");
        setProfileImage("");
        setUpdatedUser(result.user)
      })
      .catch((error) => console.log("error", error));
  }
  
  // *** Click handle for closing preview image..
  const closePrevImage = () => {
    setPreviewImage("");
    setCoverImg("");
    setProfileImage("")
  }

  // *** Profile cover image chnage handler
  const handleCoverImageChange = (e) => {
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    setCoverImg(e.target.files[0]);
  }

  // *** Upload profile cover image
  const handleProfileCoverImage = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    var formdata = new FormData();
    formdata.append("coverPicture", coverImg);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    fetch("http://localhost:5000/api/users/cover/image", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedUser(result.user)
        setIsLoading(false);
        setPreviewImage("");
        setCoverImg("");
        setOpenCoverModal("");
      })
      .catch((error) => console.log("error", error));
  }

  // *** Handle update profile bio
  const handleProfileBio = () => {
    var data = JSON.stringify({
      "bio": bio
    });

    var config = {
      method: 'put',
      url: `http://localhost:5000/api/users/${handleUn}/update/bio`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log((response.data));
        setUpdatedUser(response.data);
        setIsBioOpen(false)
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  // *** Add to hobby list
  const addToList = (value) => {
    console.log(value);
    
    if (!hobbies.includes(value)) {
      setHobbies(prev => [...prev, value]);
    } else {
      setHobbies(hobbies.filter(item => item !== value))
    }
  }

  // *** Handle user hobby
  const updateUserHobby = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "hobbies": JSON.stringify(hobbies)
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/users/update/hobies", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUpdatedUser(result);
        setIsHobbiesOpen(false);
      })
      .catch(error => console.log('error', error));
  };

  React.useEffect(() => {
    if (!country.trim()) {
      setCountryList(CountryData)
    }
    else {
      let arr = countryList
      var temp = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase().includes(country.toLowerCase())) {
          temp.push(arr[i])
        }
        setCountryList(temp);
      }
    }
  }, [country]);

  const selectCountry = (item) => {
    setCountry(item.name);
    setShowCountry(false);
    fetchAllCity(item.iso2)
  }

  const fetchAllCity = (value) => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: `https://api.countrystatecity.in/v1/countries/${value}/cities`,
      headers: {
        'X-CSCAPI-KEY': 'SkQ5WW93dldIU1N1OUdUalRXRTNKanhpODllWERhVzZXS3FsampMUA=='
      }
    };

    axios(config)
      .then(function (response) {
        setCityList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  const selectCity = (item) => {
    setCity(item.name);
    setShowCity(false);
  }

  return (
    <React.Fragment>
      {
        profile &&
        <div className='edit_profile_container'>
          {/* Profile picture modal */}
          {
            openProfilePicModal &&
            <ModalComp
              onClose={setOpenProfilePicModal}
              title={"Profile image "}
              body={
                <div className="modal_image_upload_container">
                  {
                    !previewImage ?
                      <React.Fragment>
                        <label
                          htmlFor="profile_img" className="cover_img_uploader_icon">
                          <BsCloudUpload />
                        </label>
                        <input type="file" id="profile_img" className="file_input" onChange={(e) => handleProfileImageChange(e)} />
                      </React.Fragment> :
                      <div className="profile_modal_image_container">
                        <img src={previewImage} className="modal_profile__image" />
                        <button
                          className="modal_close_prev_profile_btn"
                          onClick={closePrevImage}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                  }
                </div>
              }
              footer={
                <div className='__modal_footer'>
                  {
                    previewImage &&
                    <button
                      className={'__modal_footer_btn'}
                      onClick={handleProfileImage}
                    >
                      {
                        isLoading ? <ImSpinner2 className="spinner" /> : <>Upload</>
                      }
                    </button>
                  }
                </div>
              }
            />
          }
          {/* Profile cover image */}
          {openProfilePCoverModal &&
            <ModalComp
              onClose={setOpenProfileCoverModal}
              title={"Cover image "}
              body={
                <div className="modal_image_upload_container">
                  {
                    !previewImage ?
                      <React.Fragment>
                        <label
                          htmlFor="cover_img" className="cover_img_uploader_icon">
                          <BsCloudUpload />
                        </label>
                        <input type="file" id="cover_img" className="file_input" onChange={(e) => handleCoverImageChange(e)} />
                      </React.Fragment> :
                      <div className="cover_modal_image_container">
                        <img src={previewImage} className="preview_profile_cover_image" />
                        <button
                          className="modal_close_prev_btn"
                          onClick={closePrevImage}
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                  }
                </div>
              }
              footer={
                <div className='__modal_footer'>
                  {
                    previewImage &&
                    <button
                      className={'__modal_footer_btn'}
                      onClick={handleProfileCoverImage}
                    >
                      {
                        isLoading ? <ImSpinner2 className="spinner" /> : <>Upload</>
                      }
                    </button>
                  }
                </div>
              }
            />
          }
          {/* Profile Picture */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Profile picture")}</span>
            <button className='edit_section_button' onClick={() => setOpenProfilePicModal(true)}>Edit</button>
          </div>
          <div className='_profile_picture'>
            <img src={profile.p_i ? profile.p_i : UserAvatar} className="__profile_img" />
          </div>

          {/* Cover Picture */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Cover picture")}</span>
            <button className='edit_section_button' onClick={() => setOpenProfileCoverModal(true)}>Edit</button>
          </div>
          <div className='edit_profile_cover_image'>
            <img src={profile.c_i} className={profile.c_i ? "_edit_cover_img" : "_edit_cover_img empty__edit_cover_img"} />
          </div>

          {/* Profile Bio */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Add bio")}</span>
            <button className='edit_section_button' onClick={() => setIsBioOpen(p => !p)}>Edit</button>
          </div>
          <div className='_profile_bio'>
            {
              isBioOpen ?
                <>
                  <textarea className='_edit_profile_bio_input' placeholder={t("Describe who you are")} value={bio} onChange={e => setBio(e.target.value.slice(0, 100))}></textarea><br />
                  <button className='update_btun' onClick={handleProfileBio}>Update</button>
                </> :
                <>
                  {
                    profile.p_bio ? profile.p_bio : <>Describe yourself…</>
                  
                  }
                </>
            }
              
          </div>
          
          {/* Profile intro */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Customise your Intro")}</span>
            <button className='edit_section_button' onClick={() => setIsOpenIntro(p => !p)}>Edit</button>
          </div>
          {
            isOpenIntro &&
            <div className='into_section'>
              {/* User Work place */}
              <div className='profile_form'>
                {
                  showWork &&
                  <label className='profile_form_label'>Work</label>
                }<br />
                <input type="text"
                  placeholder={showWork ? '' : 'Enter workplace'}
                  value={work}
                  className="profile_form_input"
                  onChange={e => setWork(e.target.value)}
                  onFocus={() => setShowWork(true)}
                  onBlur={() => setShowWork(false)}
                />
              </div>
            
              {/* User School */}
              <div className='profile_form'>
                {
                  showSchool &&
                  <label className='profile_form_label'>School</label>
                }<br />
                <input type="text"
                  placeholder={showSchool ? '' : 'Enter school name'}
                  value={school}
                  className="profile_form_input"
                  onChange={e => setSchool(e.target.value)}
                  onFocus={() => setShowSchool(true)}
                  onBlur={() => setShowSchool(false)}
                />
              </div>
            
              
              {/* User lived in country */}
              <div className='profile_form'>
                {
                  showCountry &&
                  <label className='profile_form_label'>Country</label>
                }<br />
                <input type="text"
                  placeholder={showCountry ? '' : 'Enter yout country'}
                  value={country}
                  className="profile_form_input"
                  onChange={e => setCountry(e.target.value)}
                  onFocus={() => setShowCountry(true)}
                // onBlur={() => setShowCountry(false)}
                />
              
                {/* Rendering country list */}
                {
                  showCountry &&
                  <div className='country_list_section'>
                    {
                      countryList.map(item => (
                        <div key={item.iso2} className="country_card" onClick={() => selectCountry(item)}>{item.name}</div>
                      ))
                    }
                  </div>
                }
              </div>
            
              {/* User lived in city */}
              <div className='profile_form'>
                {
                  showCity &&
                  <label className='profile_form_label'>City</label>
                }<br />
                <input type="text"
                  placeholder={showCity ? '' : 'Enter city name'}
                  value={city}
                  className="profile_form_input"
                  onChange={e => setCity(e.target.value)}
                  onFocus={() => setShowCity(true)}
                // onBlur={() => setShowCity(false)}
                />
                {/* Rendering country list */}
                {
                  showCity &&
                  <div className='country_list_section'>
                    {
                      cityList.map(item => (
                        <div key={item.id} className="country_card" onClick={() => selectCity(item)}>{item.name}</div>
                      ))
                    }
                  </div>
                }
              </div>
            </div>
          }
          
          {/* Profile Basic info */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Basic information")}</span>
            <button className='edit_section_button' onClick={() => setIsOpenBasicInfo(p => !p)}>Edit</button>
          </div>
          {
            isOpenBasicInfo &&
            <div className='info_section'>
              {/* Gender */}
              <label className='profile_gender_label'>Gender</label>
              <label className='radio_btn'>
                <input type="radio"  name="male" value="Male" checked={gender === 'Male'} onChange={e => setGender(e.target.value)} />Male
              </label>
              <label className='radio_btn'>
                <input type="radio" name="female" value="Female" checked={gender === 'Female'} onChange={e => setGender(e.target.value)} />Female
              </label>
            </div>
          }

          {/* Hobbies */}
          <div className='edit_profile_picture_section'>
            <span className='edit_section_header'>{t("Add hobbies")}</span>
            <button className='edit_section_button' onClick={() => setIsHobbiesOpen(p => !p)}>Edit</button>
          </div>
          <div>
            {
              isHobbiesOpen ?
                <div className='hobby_section'>
                  <div className='hobbies_list_container'>
                    {
                      hobyLists.map((value, index) => (
                        <button className={hobbies.includes(value) ? 'hobby_tag add_tag' : 'hobby_tag'} key={index} id={value} onClick={e => addToList(e.target.id)}>{value}</button>
                      ))
                    }
                  </div>
                  <button className='update_btun' onClick={updateUserHobby}>Update</button>
                </div> :
                <div className='hobby_section'>
                  {
                    profile.u_hobbies &&
                    <>
                      {
                        profile.u_hobbies.map((value, index) => (
                          <button className={'hobby_tag add_tag'} key={index} id={value} onClick={e => addToList(e.target.id)}>{value}</button>
                        ))
                      }
                    </>
                  }
                </div>
            }
          </div>
        </div>
      }
    </React.Fragment>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  updateUser: (data) => dispatch(updateUser(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalEdit);