/** @format */

import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { setPageType } from "../../../redux/page/page.actions";
import { userLogin, updateUser } from "../../../redux/user/user.actions";
import { newPosts, setNewPinnedPost } from "../../../redux/post/post.actions";
import { useTranslation } from "react-i18next";
import {
  AiFillCaretDown,
  AiOutlineCaretUp,
  AiOutlineClose,
} from "react-icons/ai";
import axios from "axios";
const hobyLists = ["NFT", "Quiz", "Crypto", "Sports", "Treading"];
import CountryData from "../../../data/country.json";
import CriptoData from "../../../data/crypto.json";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";

const PersonalEdit = ({ user, token, axisValue, setUpdatedUser, profile }) => {
  const { handleUn } = useParams();
  const { t } = useTranslation(["common"]);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openAbout, setOpenAbout] = React.useState(false);
  const [openCurrenncy, setOpenCurrency] = React.useState(false);
  const [openInterests, setOpenInterests] = React.useState(false);
  const [openWebsite, setOpenWebsite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisable, setIsDisable] = React.useState(true);
  // First name
  const [firstName, setFirstName] = React.useState(profile.fn);
  const [collapseLabel1, setCollapseLabel1] = React.useState(false);
  const [fnClass, setFnClass] = React.useState(false);
  // Last name
  const [lastName, setLastName] = React.useState(profile.ln);
  const [collapseLabel2, setCollapseLabel2] = React.useState(false);
  const [lnClass, setLnClass] = React.useState(false);
  // Handle username
  const [handleUsername, setHandleUsername] = React.useState(profile.handleUn);
  const [collapseLabel3, setCollapseLabel3] = React.useState(false);
  const [handUnDisable, setHandleUnDisable] = React.useState(true);
  const [handleUnClass, setHandleUnClass] = React.useState(false);
  // Last name
  const [loginUsername, setLoginUsername] = React.useState(profile.log_un);
  const [collapseLabel4, setCollapseLabel4] = React.useState(false);
  const [logClass, setLogClass] = React.useState(false);
  // User Email
  const [email, setEmail] = React.useState(profile.email);
  const [collapseLabel5, setCollapseLabel5] = React.useState(false);
  const [emailDisable, setEmailDisable] = React.useState(true);
  // User phone
  const [phone, setPhone] = React.useState(profile.phone || "");
  const [collapseLabel6, setCollapseLabel6] = React.useState(false);
  const [phnClass, setPhnClass] = React.useState(false);
  // Website
  const [website, setWebsite] = React.useState(profile.website);
  const [collapseLabel7, setCollapseLabel7] = React.useState(false);
  // Interests
  const [interests, setInterests] = React.useState([...profile.interest]);
  const [collapseLabel8, setCollapseLabel8] = React.useState(false);
  const [word, setWord] = React.useState("");

  const [favCoin, setFavCoin] = React.useState(
    profile.favCoin ? [...profile.favCoin] : []
  );
  const [collapseLabel9, setCollapseLabel9] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [cryptoList, setCryptoList] = React.useState([]);
  // Bio
  const [bio, setBio] = React.useState(profile.bio || "");
  const [bioClass, setBioClass] = React.useState(false);
  const [collapseLabel10, setCollapseLabel10] = React.useState(false);
  // Gender
  const [gender, setGender] = React.useState(profile.gender || "");
  const [collapseLabel11, setCollapseLabel11] = React.useState(false);
  // Country
  const [country, setCountry] = React.useState(profile.country || "");
  const [collapseLabel12, setCollapseLabel12] = React.useState(false);
  const [countryList, setCountryList] = React.useState(CountryData);
  const [countryClass, setCountryClass] = React.useState(false);
  // City
  const [city, setCity] = React.useState(profile.city || "");
  const [cityList, setCityList] = React.useState([]);
  const [collapseLabel13, setCollapseLabel13] = React.useState(false);
  const [cityClass, setCityClass] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("account");
  const [isLoadingpage, setIsLoadingpage] = React.useState(false);

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel9(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const countryRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!countryRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel12(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const cityRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!cityRef.current.contains(event.target)) {
        // setOpenCurrency(false);
        setCollapseLabel13(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  React.useEffect(() => {
    console.log(firstName.trim().length);
    if (
      firstName.trim().length === 0 ||
      lastName.trim().length === 0 ||
      loginUsername.trim().length === 0
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [firstName, lastName, loginUsername]);

  // *** Handle update profile bio
  const handleProfileBio = () => {
    var data = JSON.stringify({
      bio: bio,
    });

    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/${handleUn}/update/bio`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setUpdatedUser(response.data);
        setIsBioOpen(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Add to hobby list
  const addToList = (value) => {
    console.log(value);

    if (!hobbies.includes(value)) {
      setHobbies((prev) => [...prev, value]);
    } else {
      setHobbies(hobbies.filter((item) => item !== value));
    }
  };

  // *** Handle user hobby
  const updateUserHobby = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      hobbies: JSON.stringify(hobbies),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/update/hobies`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setUpdatedUser(result);
        setIsHobbiesOpen(false);
      })
      .catch((error) => console.log("error", error));
  };

  const handlePhone = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      setPhone(e.target.value);
    }
  };

  // *** Handle update basic account information
  const handleUpdateInformation = () => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      logUsername: loginUsername,
      phone: phone,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/info`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
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
    var expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
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
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      website: website,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/website`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
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
  };

  // *** Handle to add data into interest array
  const handleAddInterest = (e) => {
    if (e.key === "Enter") {
      if (!interests.includes(word) && word.length > 2) {
        setInterests((prev) => [...prev, word]);
        setWord("");
      }
    }
  };

  const addToInterestList = (value) => {
    if (!interests.includes(value)) {
      setInterests((prev) => [...prev, value]);
    }
  };

  // *** Handle update interest
  const handleUpdateinterest = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      interest: interests,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/interest`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
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
    setInterests(interests.filter((val) => val !== value));
  };

  React.useEffect(() => {
    if (!search.trim()) {
      setCryptoList(CriptoData);
    } else {
      const arr = cryptoList;
      var temp = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase().includes(search.toLowerCase())) {
          temp.push(arr[i]);
        }
      }
      setCryptoList(temp);
    }
  }, [search]);

  const addCryptoCoin = (value) => {
    if (!favCoin.includes(value)) {
      setFavCoin((prev) => [...prev, value]);
    }
  };

  const handleRemovecoin = (value) => {
    setFavCoin(favCoin.filter((val) => val != value));
  };

  const handleUpdateFavouriteCoin = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      favCoin: favCoin,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/favcoin`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
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
  };

  React.useEffect(() => {
    if (!country.trim()) {
      setCountryList(CountryData);
    } else {
      let arr = countryList;
      var temp = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name.toLowerCase().includes(country.toLowerCase())) {
          temp.push(arr[i]);
        }
        setCountryList(temp);
      }
    }
  }, [country]);

  const selectCountry = (item) => {
    setCountry(item.name);
    setCollapseLabel12(false);
    fetchAllCity(item.iso2);
  };

  // *** Fetch all city
  const fetchAllCity = (value) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `https://api.countrystatecity.in/v1/countries/${value}/cities`,
      headers: {
        "X-CSCAPI-KEY":
          "SkQ5WW93dldIU1N1OUdUalRXRTNKanhpODllWERhVzZXS3FsampMUA==",
      },
    };

    axios(config)
      .then(function (response) {
        setCityList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const selectCity = (item) => {
    setCity(item.name);
    setCollapseLabel13(false);
  };

  // *** Handle update user About
  const handleUpdateAbout = () => {
    setIsLoading(true);
    var axios = require("axios");
    var data = JSON.stringify({
      bio: bio,
      gender: gender,
      country: country,
      city: city,
    });
    var config = {
      method: "put",
      url: `${process.env.REACT_APP_URL_LINK}api/users/update/user/about`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(response.data);
        setUpdatedUser(response.data);
        setIsLoading(false);
        setOpenAbout(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // *** Slecting class for firstname
  React.useEffect(() => {
    if (!firstName.trim()) {
      setFnClass(false);
    } else {
      setFnClass(true);
    }
  }, [firstName]);

  // *** Slecting class for firstname
  React.useEffect(() => {
    if (!lastName.trim()) {
      setLnClass(false);
    } else {
      setLnClass(true);
    }
  }, [lastName]);

  // *** Slecting class for login username
  React.useEffect(() => {
    if (!loginUsername.trim()) {
      setLogClass(false);
    } else {
      setLogClass(true);
    }
  }, [loginUsername]);

  // *** Slecting class for phone nimber
  React.useEffect(() => {
    if (phone <= 0) {
      setPhnClass(false);
    } else {
      setPhnClass(true);
    }
  }, [phone]);

  // *** Slecting class for bio
  React.useEffect(() => {
    if (!bio.trim()) {
      setBioClass(false);
    } else {
      setBioClass(true);
    }
  }, [bio]);

  // *** Slecting class for country
  React.useEffect(() => {
    if (!country.trim()) {
      setCountryClass(false);
    } else {
      setCountryClass(true);
    }
  }, [country]);

  // *** Slecting class for city
  React.useEffect(() => {
    if (!city.trim()) {
      setCityClass(false);
    } else {
      setCityClass(true);
    }
  }, [city]);

  const handleChangeTab = (value) => {
    setActiveTab(value);
    setIsLoadingpage(true);
    setTimeout(() => {
      setIsLoadingpage(false);
    }, 1000);
  };

  return (
    <div className='profile_edit_page'>
      {/* Edit header tab */}
      <div className='profile_edit_tabs_section'>
        <button
          className={
            activeTab === "account"
              ? "__profile_edit_btn __profile_edit_btn_active"
              : "__profile_edit_btn"
          }
          onClick={() => setActiveTab("account")}>
          Account
        </button>
        <button
          className={
            activeTab === "profile"
              ? "__profile_edit_btn __profile_edit_btn_active"
              : "__profile_edit_btn"
          }
          onClick={() => setActiveTab("profile")}>
          Profile
        </button>
        <button
          className={
            activeTab === "privacy"
              ? "__profile_edit_btn __profile_edit_btn_active"
              : "__profile_edit_btn"
          }
          onClick={() => setActiveTab("privacy")}>
          Privacy
        </button>
        <button
          className={
            activeTab === "notification"
              ? "__profile_edit_btn __profile_edit_btn_active"
              : "__profile_edit_btn"
          }
          onClick={() => setActiveTab("notification")}>
          Notifications
        </button>
        <button
          className={
            activeTab === "Subscription"
              ? "__profile_edit_btn __profile_edit_btn_active"
              : "__profile_edit_btn"
          }
          onClick={() => setActiveTab("Subscription")}>
          Subscription
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  update: state.user.updateUser,
  axisValue: state.page.axisValue,
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
