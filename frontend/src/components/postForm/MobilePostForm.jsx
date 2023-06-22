/** @format */
import React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineFileImage } from "react-icons/ai";
import { BsEmojiHeartEyes } from "react-icons/bs";
import Loader from "../Loader/Loader";
import { putPosts } from "../../redux/post/post.actions";
import { GrClose } from "react-icons/gr";
import "./PostForm.css";
// import Image from "../../Assets/image.png";
import Tooltip from "../Tooltip/Tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineGif } from "react-icons/ai";
import GifModal from "../modal/GifModal";
import { FiVideo } from "react-icons/fi";
import { Icon } from "../../Icons/Index";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
// import GippyModal from "../GipphyModal/GippyModal";
import { BiPoll } from "react-icons/bi";
import MyModal from "../modal/MyModal";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import UserAvatar from "../../Assets/userAvatar.webp";
import CustomPostFormModal from "../modal/CustomPostFormModal";
import { ImSpinner2 } from "react-icons/im";
import { MdCreateNewFolder } from "react-icons/md";

const maxLength = 200;
function MobilePostForm({ user, token, putPosts }) {
  const { t } = useTranslation(["common"]);
  const [value, setValue] = useState("");
  var invalid = value.trim() === "" ? true : false;
  const [config, setConfig] = useState(null);
  const [isDisableText, setIsDisableText] = useState(false);
  const [openGifModal, setOpenGifModal] = useState(false);
  const [gif, setGif] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [showDrop, setShowdrop] = useState(false);
  // const [chosenEmoji, setChosenEmoji] = useState(null);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showStickerModal, setShowStickerModal] = useState("");
  
  // Create Poll state
  const [openPoll, setOpenPoll] = useState(false);
  const [days, setDays] = useState("1");
  const [hours, setHours] = useState("0");
  const [min, setMin] = useState("0");
  const [btnDisable, setBtnDisable] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showErrorStatus, setShowErrorStatus] = useState(false);

  // For poll
  const [question, setQuestion] = React.useState("");
  const [opt1, setOpt1] = React.useState("");
  const [opt2, setOpt2] = React.useState("");
  const [hour, setHour] = React.useState();


  // New 
  const [content, setContent] = React.useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showLabel, setShowLabel] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [image, setImage] = React.useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [oepnGif, setOpenGif] = React.useState(false);
  const [gifs, setGifs] = useState([]);
  const [limit, setLimit] = useState(5);
  const [openPostModal, setOpenPostModal] = React.useState(false);

  var arr = ["All", "Only follower", "Only me"];

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}post/config`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setConfig(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setValue(value.slice(0, maxLength - 1));
    setValue(value);
    setWordCount(event.target.value.length);
  };

  const checkLength = (e) => {
    if (e.keyCode === 8 || wordCount > 0) {
      setWordCount(p => p - 1);
    } else {
      setWordCount(p => p + 1);
    }
  };
  

  

  const closeImagePreview = () => {
    setImage("");
    setImagePreview("");
  };

  const handleDropdown = (e, index) => {
    setPrivacy(arr[index]);
    setShowdrop(false);
  };

  const createPoll = () => {
    var axios = require('axios');
    var data = JSON.stringify({
      "question": question,
      "opt1": opt1,
      "opt2": opt2
    });

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_URL_LINK}api/posts/poll`,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        putPosts([response.data]);
        setOpenPoll(false);
      })
      .catch(function (error) {
        console.log(error);
      });

  };

  const handleSetTime = (e) => {
    console.log(e)
  }

  // Start from here
  // *** Check maximum 200 character in input
  const inputChangeHandler = (e) => {
    if (e.target.value.length <= 200) {
      setContent(e.target.value);
      setCount(prev => prev+1)
    } else {
      setIsDisable(true);
      setShowLabel(true)
    }
  }

  const checkInputLength = (e) => {
    if (e.key === 'Backspace') {
      setCount(prev => prev - 1);
    }
  }

  React.useEffect(() => {
    if (!content.trim()) {
      if (!image) {
        setIsDisable(true)
      } else {
        setIsDisable(false)
      }
    } else {
      setIsDisable(false)
    }
  }, [content, image]);

  // *** Handle image change
  const handleFileChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };
  const closeImage = () => {
    setImage("");
    setImagePreview("");
  }

  const handleSubmit = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var formdata = new FormData();
    formdata.append("content", content);
    formdata.append("gif", gif);
    formdata.append("image", image);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/posts?flwr_count=${user.flwr_c}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setIsLoading(false);
        setIsDisable(true);
        setValue("");
        setContent("")
        putPosts([result]);
        setImagePreview(false);
        setShowEmoji(false);
        setShowErrorStatus(false);
        setWordCount(0);
        setShowLabel(false);
        setOpenPostModal(false);
      })
      .catch(error => {
        console.log('error', error);
        setImagePreview(false);
        setShowEmoji(false);
        setShowErrorStatus(false);
        setWordCount(0);
        setShowLabel(false); setIsLoading(false);
        setIsDisable(true);
      });
  };

  const addEmoji = (e) => {
    setContent((prev) => prev + e.native);
  };

  // *** Feach gifs
  React.useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=QtQnZ2h65BcHyuHsQMrYzEzZLg5t8SfE&limit=${limit}&rating=g`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.data);
        setGifs(result.data);
      })
      .catch(error => console.log('error', error));
  }, [limit]);

  const handleAssign = (url) => {
    setImagePreview(url);
    setGif(url);
    setOpenGif(false)
  }
  const handleCloseImage = () => {
    setImage("");
    setImagePreview("")
  }

  const closeModal = () => {
    setOpenPostModal(true)
  }

  return (
    user && (
      <React.Fragment>
        {
          openPostModal &&
          <CustomPostFormModal
            onClose={closeModal}
          />
        }
      </React.Fragment>
    )
  )
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  putPosts: (posts) => dispatch(putPosts(posts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MobilePostForm);