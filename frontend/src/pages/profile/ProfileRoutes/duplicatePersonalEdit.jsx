import React from 'react';
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../../redux/page/page.actions";
import { userLogin, updateUser } from "../../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import { AiFillCaretDown, AiOutlineCaretUp, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
const hobyLists = ['NFT', 'Quiz', 'Crypto', 'Sports', 'Treading'];
import CountryData from "../../../data/country.json";
import CriptoData from "../../../data/crypto.json";

const PersonalEdit = ({ user, token, axisValue, setUpdatedUser, profile }) => {
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openAbout, setOpenAbout] = React.useState(false);
  const [openCurrenncy, setOpenCurrency] = React.useState(false);
  const [openInterests, setOpenInterests] = React.useState(false);
  const [openWebsite, setOpenWebsite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true)
  // First name
  const [firstName, setFirstName] = React.useState(profile.fn);
  const [collapseLabel1, setCollapseLabel1] = React.useState(false);
  // Last name
  const [lastName, setLastName] = React.useState(profile.ln);
  const [collapseLabel2, setCollapseLabel2] = React.useState(false);
  // Handle username
  const [handleUsername, setHandleUsername] = React.useState(profile.handleUn);
  const [collapseLabel3, setCollapseLabel3] = React.useState(false);
  const [handUnDisable, setHandleUnDisable] = React.useState(true);
  // Last name
  const [loginUsername, setLoginUsername] = React.useState(profile.log_un);
  const [collapseLabel4, setCollapseLabel4] = React.useState(false);
  // User Email
  const [email, setEmail] = React.useState(profile.email);
  const [collapseLabel5, setCollapseLabel5] = React.useState(false);
  const [emailDisable, setEmailDisable] = React.useState(true);
  // User phone
  const [phone, setPhone] = React.useState(profile.phone);
  const [collapseLabel6, setCollapseLabel6] = React.useState(false);
  // Website
  const [website, setWebsite] = React.useState(profile.website);
  const [collapseLabel7, setCollapseLabel7] = React.useState(false);
  // Interests
  const [interests, setInterests] = React.useState([...profile.interest]);
  const [collapseLabel8, setCollapseLabel8] = React.useState(false);
  const [word, setWord] = React.useState("");

  const [favCoin, setFavCoin] = React.useState(profile.favCoin ? [...profile.favCoin] : []);
  const [collapseLabel9, setCollapseLabel9] = React.useState(false);
  const [search, setSearch] = React.useState("")
  const [cryptoList, setCryptoList] = React.useState([]);
  // Bio
  const [bio, setBio] = React.useState(profile.bio);
  const [collapseLabel10, setCollapseLabel10] = React.useState(false);
  // Gender
  const [gender, setGender] = React.useState(profile.gender);
  const [collapseLabel11, setCollapseLabel11] = React.useState(false);
  // Country
  const [country, setCountry] = React.useState("");
  const [collapseLabel12, setCollapseLabel12] = React.useState(false);
  const [countryList, setCountryList] = React.useState(CountryData)
  // City
  const [city, setCity] = React.useState("");
  const [cityList, setCityList] = React.useState([]);
  const [collapseLabel13, setCollapseLabel13] = React.useState(false);


  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel9(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  }, [])

  const countryRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!countryRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel12(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  }, []);

  const cityRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!cityRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel13(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    }
  }, [])



  React.useEffect(() => {
    console.log(firstName.trim().length)
    if (firstName.trim().length === 0 || lastName.trim().length === 0 || loginUsername.trim().length === 0) {
      setIsDisable(true)
    } else {
      setIsDisable(false)
    }
  }, [firstName, lastName, loginUsername])

  // *** Handle update profile bio
  const handleProfileBio = () => {
    var data = JSON.stringify({
      "bio": bio
    });

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/${handleUn}/update/bio`,
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

    fetch(`${process.env.REACT_APP_URL_LINK}api/users/update/hobies`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setUpdatedUser(result);
        setIsHobbiesOpen(false);
      })
      .catch(error => console.log('error', error));
  };

  

  const handlePhone = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setPhone(e.target.value)
    }
  }

  // *** Handle update basic account information
  const handleUpdateInformation = () => {
    setIsLoading(true)
    var axios = require('axios');
    var data = JSON.stringify({
      "firstName": firstName,
      "lastName": lastName,
      "logUsername": loginUsername,
      "phone": phone
    });
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/info`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    }
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setUpdatedUser(response.data);
        setOpenInfo(false);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Check website link is valid or not 
  React.useEffect(() => {
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    if (website && website.trim()) {
      if (website.match(regex)) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    }
  }, [website]);

  // *** Handle update user website link
  const handleUpdateWebsiteLink = () => {
    setIsLoading(true)
    var axios = require('axios');
    var data = JSON.stringify({
      "website": website
    });
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/website`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    }
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setUpdatedUser(response.data);
        setIsLoading(false);
        setOpenWebsite(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // *** Handle to add data into interest array
  const handleAddInterest = (e) => {
    if (e.key === "Enter") {
      if (!interests.includes(word) && word.length > 2) {
        setInterests(prev => [...prev, word]);
        setWord("")
      }
    }
  }

  const addToInterestList = (value) => {
    if (!interests.includes(value)) {
      setInterests(prev => [...prev, value]);
    }
  }

  // *** Handle update interest
  const handleUpdateinterest = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "interest": interests
    });
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/interest`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setUpdatedUser(response.data);
        setOpenInterests(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRemoveInterest = (value) => {
    setInterests(interests.filter(val => val !== value));
  }

  React.useEffect(() => {
    if (!search.trim()) {
      setCryptoList(CriptoData)
    } else {
      const arr = cryptoList;
      var temp = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase().includes(search.toLowerCase())) {
          temp.push(arr[i])
        }
      }
      setCryptoList(temp)
    }
  }, [search])

  const addCryptoCoin = (value) => {
    if (!favCoin.includes(value)) {
      setFavCoin(prev => [...prev, value])
    }
  }

  const handleRemovecoin = (value) => {
    setFavCoin(favCoin.filter(val => val != value))
  }

  const handleUpdateFavouriteCoin = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "favCoin": favCoin
    });
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/favcoin`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        setUpdatedUser(response.data);
        setOpenCurrency(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
    setCollapseLabel12(false);
    fetchAllCity(item.iso2)
  }

  // *** Fetch all city
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
    setCollapseLabel13(false);
  }

  // *** Handle update user About
  const handleUpdateAbout = () => {
    setIsLoading(true)
    var axios = require('axios');
    var data = JSON.stringify({
      "bio": bio,
      "gender": gender,
      "country": country,
      "city": city
    });
    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/about`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    }
    axios(config)
      .then(function (response) {
        console.log((response.data));
        setUpdatedUser(response.data);
        setIsLoading(false);
        setOpenAbout(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  return (
    <div className={axisValue > 1 ? "scroll__profile_edit_setion" :"__profile_edit_setion"}>
      {/* Basic account information */}
      <div className='edit_box'>
        <span className='edit_header_title'>{t("Basic account information")}</span>
        {
          profile.handleUn === user.handleUn &&
          <button className={openInfo ? 'profile_edit_button_close' : 'profile_edit_button'} onClick={() => setOpenInfo(prev => !prev)}>
            {
              openInfo ? <>{t("Close")}</> : <>{t("Edit")}</>
            }
          </button>
        }
      </div>
      {
        openInfo ?
          <div>
            {/* First name input form */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel1(true)} onBlur={() => setCollapseLabel1(false)}>
              {
                collapseLabel1 &&
                <label className='input_form_label'>{t("First name")}{" "}<span className='require_input'>{t("(*required)")}</span></label>
              }<br />
              <input
                type="text"
                value={firstName}
                placeholder="First name"
                className='edit_input'
                onChange={e => setFirstName(e.target.value)}
              />
            </div>

            {/* Second name input form */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel2(true)} onBlur={() => setCollapseLabel2(false)}>
              {
                collapseLabel2 &&
                <label className='input_form_label'>{t("Last name")}{" "}<span className='require_input'>{t("(*required)")}</span></label>
              }<br />
              <input
                type="text"
                value={lastName}
                placeholder="Last name"
                className='edit_input'
                onChange={e => setLastName(e.target.value)}
              />
            </div>

            {/* Handle username */}
            <div className={handUnDisable ? 'edit_input_form disable_edit_input_form' : 'edit_input_form'}>
              <label className={handUnDisable ? 'input_form_label' : 'input_form_label'}>{t("Handle username")}</label>
              <br />
              <input
                type="text"
                disabled
                value={handleUsername}
                placeholder="Last name"
                className={handUnDisable === true ? 'disable_edit_input edit_input' : 'edit_input'}
                onChange={e => setHandleUsername(e.target.value)}
              />
            </div>

            {/* Login username input form */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel4(true)} onBlur={() => setCollapseLabel4(false)}>
              {
                collapseLabel4 &&
                <label className='input_form_label'>{t("Login username")}{" "}<span className='require_input'>{t("(*required)")}</span></label>
              }<br />
              <input
                type="text"
                value={loginUsername}
                placeholder="Login username"
                className='edit_input'
                onChange={e => setLoginUsername(e.target.value)}
              />
            </div>

            {/* Handle Email */}
            <div className={emailDisable ? 'edit_input_form disable_edit_input_form' : 'edit_input_form'}>
              <label className={emailDisable ? 'input_form_label' : 'input_form_label'}>{t("Email")}</label>
              <br />
              <input
                type="text"
                disabled
                value={email}
                placeholder="Email"
                className={emailDisable === true ? 'disable_edit_input edit_input' : 'edit_input'}
                onChange={e => email(e.target.value)}
              />
            </div>

            {/* User phone number */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel6(true)} onBlur={() => setCollapseLabel6(false)}>
              {
                collapseLabel6 &&
                <label className='input_form_label'>{t("Phone")}{" "}</label>
              }<br />
              <input
                type="text"
                value={phone}
                placeholder="Phone"
                className='edit_input'
                onChange={e => handlePhone(e)}
              />
            </div>

            <div className='edit_button_container'>
              <button
                className={isDisable ? 'edit_upadate_btn disable_edit_upadate_btn' : 'edit_upadate_btn'}
                onClick={handleUpdateInformation}
              >Update</button>
            </div>
          </div> :
          <div className='account_basci_info'>
            {/* User first name */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("First name")}</span>
              <span className='sub_box_title'>{profile.fn}</span>
            </div>
            {/* User last name */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Last name")}</span>
              <span className='sub_box_title'>{profile.ln}</span>
            </div>
            {/* User handle username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Handle username")}</span>
              <span className='sub_box_title'>{profile.handleUn}</span>
            </div>
            {/* User login username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Login username")}</span>
              <span className='sub_box_title'>{profile.log_un}</span>
            </div>
            {/* User Email */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("User Email")}</span>
              <span className='sub_box_title'>{profile.email}</span>
            </div>
            {/* User login username */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("User phone")}</span>
              <span className='sub_box_title'>{profile.phone}</span>
            </div>
          </div>
      }

      {/* Profile user about */}
      <div className='edit_box'>
        <span className='edit_header_title'>{t("About")}</span>
        {
          user.handleUn === profile.handleUn &&
          <button className={openInfo ? 'profile_edit_button_close' : 'profile_edit_button'} onClick={() => setOpenAbout(prev => !prev)}>
            {
              openAbout ? <>{t("Close")}</> : <>{t("Edit")}</>
            }
          </button>
        }
      </div>
      {
        openAbout ?
          <div className='edit_account_basci_info'>
            {/* Profile bio */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel10(true)} onBlur={() => setCollapseLabel10(false)}>
              {
                collapseLabel10 &&
                <label className='input_form_label'>{t("Profile bio")}</label>
              }<br />
              <textarea
                type="text"
                value={bio}
                placeholder={!collapseLabel10 && "Profile bio"}
                className='edit_textarea_input'
                onChange={e => setBio(e.target.value.slice(0, 100))}
              />
            </div>
            
            {/* User gender */}
            <div className='edit_radio_container'>
              <label className='profile_gender_label'>Gender</label>
              <label className='radio_btn'>
                {/* Male */}
                <input type="radio" name="male" value="Male" checked={gender === 'Male'} onChange={e => setGender(e.target.value)} />Male
              </label>

              {/* Female */}
              <label className='radio_btn'>
                <input type="radio" name="female" value="Female" checked={gender === 'Female'} onChange={e => setGender(e.target.value)} />Female
              </label>

              {/* All */}
              <label className='radio_btn'>
                <input type="radio" name="ntt" value="NTT" checked={gender === 'NTT'} onChange={e => setGender(e.target.value)} />Not to tell
              </label>
            </div>

            {/* Country */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel12(true)}>
              {
                collapseLabel12 &&
                <label className='input_form_label'>{t("Country")}</label>
              }<br />
              <input
                type="text"
                value={country}
                placeholder={!collapseLabel12 && "country"}
                className='edit_input'
                onChange={e => setCountry(e.target.value)}
              />
            </div>
            {
              collapseLabel12 &&
              <div className='country_lists_section' ref={countryRef}>
                {
                  countryList.map((value, index) => (
                    <div key={index} className="country_list" onClick={() => selectCountry(value)}>{value.name}</div>
                  ))
                }
              </div>
            }

            {/* City */}
            <div className='edit_input_form' onFocus={() => setCollapseLabel13(true)}>
              {
                collapseLabel13 &&
                <label className='input_form_label'>{t("City")}</label>
              }<br />
              <input
                type="text"
                value={city}
                placeholder={!collapseLabel13 && "City"}
                className='edit_input'
                onChange={e => setCity(e.target.value)}
              />
            </div>
            {
              (collapseLabel13) ?
                <div className='country_lists_section' ref={cityRef}>
                  {
                    cityList.map((value, index) => (
                      <div key={index} className="country_list" onClick={() => selectCity(value)}>{value.name}</div>
                    ))
                  }
                </div> : null
            }
            <div className='edit_button_container'>
              <button
                className='edit_upadate_btn'
                onClick={handleUpdateAbout}
              >Update</button>
            </div>
          </div> :
          <div className='account_basci_info'>
            {/* User profile bio */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Bio")}</span>
              <span className='sub_box_title'>{profile.bio}</span>
            </div>
            {/* User Gender */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Gender")}</span>
              <span className='sub_box_title'>{profile.gender}</span>
            </div>
            {/* User country */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Country")}</span>
              <span className='sub_box_title'>{profile.country}</span>
            </div>
            {/* User Gender */}
            <div className='sub_box'>
              <span className='sub_box_header'>{t("City")}</span>
              <span className='sub_box_title'>{profile.city}</span>
            </div>
          </div>
      }

      {/* Favourite crypto currency */}
      <div className='edit_box'>
        <span className='edit_header_title'>{t("Basic account information")}</span>
        {
          profile.handleUn === user.handleUn &&
          <button className={openCurrenncy ? 'profile_edit_button_close' : 'profile_edit_button'} onClick={() => setOpenCurrency(prev => !prev)}>
            {
              openCurrenncy ? <>{t("Close")}</> : <>{t("Edit")}</>
            }
          </button>
        }
      </div>
      {
        openCurrenncy ?
          <div className='edit_account_basci_info crptyo_edit_account_basci_info'>
            {
              (favCoin || []).length > 0 &&
              <>
                {
                  favCoin.map((data, index) => (
                    <button className='coin_tag' key={index} onClick={() => handleRemovecoin(data)}>
                      <span>{data}</span>
                      <span><AiOutlineClose /></span>
                    </button>
                  ))
                }
              </>
            }
            <div className='edit_input_form' onFocus={() => setCollapseLabel9(true)}>
              {
                collapseLabel9 &&
                <label className='input_form_label'>{t("Favourite Coin")}</label>
              }<br />
              <input
                type="text"
                value={search}
                placeholder="Favourite Coin"
                className='edit_input'
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {
              collapseLabel9 &&
              <div className='edit_drop_meanu' ref={menuRef}>
                {
                  cryptoList.map((data, index) => (
                    <div className='menu_list' key={index} onClick={() => addCryptoCoin(data.name)}>
                      <img src={data.image} className="crypto_img" />
                      <span className='menu_item_name'>{data.name}</span>
                    </div>
                  ))
                }
              </div>
            }
            <div className='edit_button_container'>
              <button
                className='edit_upadate_btn'
                onClick={handleUpdateFavouriteCoin}
              >Update</button>
            </div>
          </div> :
          <div className='account_basci_info'>
            {
              (favCoin || []).length > 0 ?
                <div className='tag_section'>
                  {
                    favCoin.map((value, index) => (
                      <span className='interest_tag' key={index}>{value}</span>
                    ))
                  }
                </div> :
                <div>{t("No interest has been set")}</div>
            }
          </div>
      }

      {/* Interestes */}
      <div className='edit_box'>
        <span className='edit_header_title'>{t("Interests")}</span>
        {
          profile.handleUn === user.handleUn &&
          <button className={openInterests ? 'profile_edit_button_close' : 'profile_edit_button'} onClick={() => setOpenInterests(prev => !prev)}>
            {
              openInterests ? <>{t("Close")}</> : <>{t("Edit")}</>
            }
          </button>
        }
      </div>
      {
        openInterests ?
          <div className='edit_account_basci_info'>
            <div className='interest_tag_container'>
              {
                (interests || []).length > 0 &&
                <>
                  {
                    interests.map((value, index) => (
                      <button className='interest_button' key={index} onClick={() => handleRemoveInterest(value)}>
                        {value}
                        <span><AiOutlineClose /></span>
                      </button>
                    ))
                  }
                </>
              }
            </div>
            <div className='edit_input_form' onFocus={() => setCollapseLabel8(true)} onBlur={() => setCollapseLabel8(false)}>
              {
                collapseLabel8 &&
                <label className='input_form_label'>{t("Interests")}</label>
              }<br />
              <input
                type="text"
                value={word}
                placeholder="Interests"
                className='edit_input'
                onChange={e => setWord(e.target.value)}
                onKeyDown={e => handleAddInterest(e)}
              />
            </div>
            <div className='auggested_tag_container'>
              <span className='interest_header'>Suggested</span><br />
              {
                hobyLists.map((value, index) => (
                  <span key={index} className="suggested_interest_tag" onClick={() => addToInterestList(value)}>{value}</span>
                ))
              }
            </div>
            <div className='edit_button_container'>
              <button
                className='edit_upadate_btn'
                onClick={handleUpdateinterest}
              >Update</button>
            </div>
          </div> :
          <div className='account_basci_info'>
            {
              (interests || []).length > 0 ?
                <div className='tag_section'>
                  {
                    interests.map((value, index) => (
                      <span className='interest_tag' key={index}>{value}</span>
                    ))
                  }
                </div> :
                <div>{t("No interest has been set")}</div>
            }
          </div>
      }

      {/* User Website */}
      <div className='edit_box'>
        <span className='edit_header_title'>{t("Website")}</span>
        {
          profile.handleUn === user.handleUn &&
          <button className={openWebsite ? 'profile_edit_button_close' : 'profile_edit_button'} onClick={() => setOpenWebsite(prev => !prev)}>
            {
              openWebsite ? <>{t("Close")}</> : <>{t("Edit")}</>
            }
          </button>
        }
      </div>
      {
        openWebsite ?
          <div className='edit_account_basci_info'>
            <div className='edit_input_form' onFocus={() => setCollapseLabel7(true)} onBlur={() => setCollapseLabel7(false)}>
              {
                collapseLabel7 &&
                <label className='input_form_label'>{t("Website")}</label>
              }<br />
              <input
                type="text"
                value={website}
                placeholder="Website link"
                className='edit_input'
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
            {
              isDisable && <span className='invalidlink'>Not a valid link.</span>
            }
            <div className='edit_button_container'>
              <button
                className={isDisable ? 'edit_upadate_btn disable_edit_upadate_btn' : 'edit_upadate_btn'}
                onClick={handleUpdateWebsiteLink}
              >Update</button>
            </div>
          </div> :
          <div className='account_basci_info'>
            <div className='sub_box'>
              <span className='sub_box_header'>{t("Website link")}</span>
              <a href={profile.website} className='sub_box_title link'>{profile.website}</a>
            </div>
          </div>
      }
    </div>
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser,
  axisValue: state.page.axisValue
});
const mapDispatchToProps = (dispatch) => ({
  login: (user, token) => dispatch(userLogin(user, token)),
  newPosts: (posts) => dispatch(newPosts(posts)),
  setPinnedPost: (post) => dispatch(setNewPinnedPost(post)),
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  updateUser: (data) => dispatch(updateUser(data)),
  setUpdatedUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalEdit);