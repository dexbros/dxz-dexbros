/** @format */

import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { GrAnnounce } from "react-icons/gr";
import { MdCreateNewFolder } from "react-icons/md";
import { ReactComponent as BlockIcon } from "../../../Assets/Icons/cube.svg";
import { ReactComponent as LinkIcon } from "../../../Assets/Icons/link.svg";
// import CustomModal from "../../modal/CustomModal"
import CustomPostFormModal from "../../modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
import CryptoData from "../../../data/crypto.json";
import { addMyBlock } from "../../../redux/Group/group.actions";
import "dexbrosicons/style.css";

const BlockDownNavar = ({ user, token, addNewBlock, axisValue }) => {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();

  // Token name
  const [type, setType] = React.useState("");
  const [isTypeFocus, setIsTypeFocus] = React.useState(false);
  const [isTypeEmpty, setIsTypeEmpty] = React.useState(true);

  // Token symbol
  const [symbol, setSymbol] = React.useState("");
  const [isSymbolFocus, setIsSymbolFocus] = React.useState(false);
  const [isSymbolEmpty, setIsSymbolEmpty] = React.useState(true);
  const [showSymbolInput, setShowSymbolInput] = React.useState(false);

  // name
  const [name, setName] = React.useState("");
  const [isNameFocus, setIsNameFocus] = React.useState(false);
  const [isNameEmpty, setIsNameEmpty] = React.useState(true);

  // description
  const [description, setDescription] = React.useState("");
  const [isDesFocus, setIsDesFocus] = React.useState(false);
  const [isDesEmpty, setIsDesEmpty] = React.useState(true);

  const [openModal, setOpenModal] = React.useState(false);
  const [isDesVisible, setIsDesVisible] = React.useState(false);
  const [accountType, setAccountType] = React.useState("business");
  const [isDisable, setIsDisable] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [catVisible, setCatVisible] = React.useState(false);
  const [isVisibleMenu, setsVisibleMenu] = React.useState(false);
  const [lists, setLists] = React.useState([]);
  const [searchList, setSearchList] = React.useState();
  const [isSymbolVisible, setIsSymbolVisible] = React.useState(false);

  const onClose = () => {
    setOpenModal(false);
  };

  // Ref for textarea field
  const textareaRef = React.useRef();

  // *** handle open block create modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // *** Handle radio change
  const handleRadioChange = (e) => {
    setAccountType(e.target.value);
  };

  // *** Check for create button
  React.useEffect(() => {
    if (!name.trim() || !description.trim() || !type.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, description, type]);

  // *** Handle block create api
  const createGroup = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: name,
      body: description,
      type: type,
      accountType: accountType,
      symbol: symbol,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/group", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        addNewBlock(result.group);
        setIsLoading(false);
        setOpenModal(false);
        setName("");
        setDescription("");
        setType("");
        setAccountType("normal");
        setIsLoading(false);
        setIsDisable(true);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/fetch/crypto", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setLists(result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const handleFocus = () => {
    setCatVisible(true);
    setsVisibleMenu(true);
  };

  const handleAddType = (data) => {
    setType(data.name);
    setIsTypeFocus(false);
    setSymbol(data.symbol);
    // setShowSymbolInput(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setsVisibleMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleCryptoInput = (e) => {
    setType(e.target.value.slice(0, 40));
    const temp = lists;
    var result = [];
    const arr = temp.filter((data) =>
      data.name.toLowerCase().includes(e.target.value)
    );
    setSearchList(arr);
  };

  const handleAddCryptoInList = () => {
    setSymbol(type.slice(0, 3));
    setsVisibleMenu(false);
    setShowSymbolInput(true);
  };

  React.useEffect(() => {
    if (!type.trim()) {
      setIsTypeEmpty(true);
    } else {
      setIsTypeEmpty(false);
    }
  }, [type]);

  React.useEffect(() => {
    if (!symbol.trim()) {
      setIsSymbolEmpty(true);
    } else {
      setIsSymbolEmpty(false);
    }
  }, [symbol]);

  React.useEffect(() => {
    if (!name.trim()) {
      setIsNameEmpty(true);
    } else {
      setIsNameEmpty(false);
    }
  }, [name]);

  React.useEffect(() => {
    if (!description.trim()) {
      setIsDesEmpty(true);
    } else {
      setIsDesEmpty(false);
    }
  }, [description]);

  const handleAddCustomToken = () => {
    alert("Call handleAddCustomToken");
    setShowSymbolInput(true);
    setIsTypeFocus(false);
  };

  return (
    <div
      className={
        axisValue === "Up" ? "down_navbar_container" : "hide_down_navbar"
      }>
      {openModal && (
        <CustomPostFormModal
          title={
            <div className='post_form_modal_title'>
              <div className='modal_post_form_section'>
                <button className='post_close_modal_button' onClick={onClose}>
                  <BiArrowBack />
                </button>
                <span className='modal_title_text'>Create new block</span>
              </div>

              {!isDisable && (
                <button className='_modal_post_button' onClick={createGroup}>
                  Create
                </button>
              )}
            </div>
          }
          body={
            <div className='modal_body_container'>
              <div className='modal_input_box'>
                <input
                  type='text'
                  placeholder={isTypeFocus && "Search crypto token"}
                  className='block_modal_input'
                  id='type'
                  value={type}
                  autoComplete='off'
                  onChange={(e) => handleCryptoInput(e)}
                  onFocus={() => setIsTypeFocus(true)}
                  // onBlur={() => setIsTypeFocus(false)}
                />
                <label
                  htmlFor='type'
                  className={
                    isTypeFocus || !isTypeEmpty
                      ? "modal_input_label_up"
                      : "modal_input_label"
                  }>
                  Token name
                </label>

                {isTypeFocus && (
                  <div className='drop_menu'>
                    {!type ? (
                      <>
                        {(lists || []).length > 0 ? (
                          <>
                            {lists.map((data) => (
                              <div
                                key={data._id}
                                className='crypto_list'
                                onClick={() => handleAddType(data)}>
                                <span class={`icon icon-${data.symbol}`}></span>
                                <span className='crypto_name'>{data.name}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>Loading</>
                        )}
                      </>
                    ) : (
                      <>
                        {(searchList || []).length > 0 ? (
                          <>
                            {searchList.map((data, index) => (
                              <div
                                key={index}
                                className='crypto_list'
                                onClick={() => handleAddType(data)}>
                                <span class={`icon icon-${data.symbol}`}></span>
                                <span className='crypto_name'>{data.name}</span>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className='empty_crypto_list'>
                            <span className='empty_crypto_text'>
                              No data found
                            </span>
                            <br />
                            <button
                              className='add_crypto_btn'
                              onClick={() => handleAddCustomToken()}>
                              Add your own
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {showSymbolInput && (
                <div className='modal_input_box'>
                  <input
                    type='text'
                    placeholder={isSymbolFocus && "Enter your token symbol"}
                    className='block_modal_input'
                    id='symbol'
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.slice(0, 5))}
                    onFocus={() => setIsSymbolFocus(true)}
                    onBlur={() => setIsSymbolFocus(false)}
                  />
                  <label
                    htmlFor='symbol'
                    className={
                      isSymbolFocus || !isSymbolEmpty
                        ? "modal_input_label_up"
                        : "modal_input_label"
                    }>
                    Token symbol
                  </label>
                </div>
              )}

              <div className='modal_input_box'>
                <input
                  type='text'
                  placeholder={isNameFocus && "Enter block name"}
                  className='block_modal_input'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  onFocus={() => setIsNameFocus(true)}
                  onBlur={() => setIsNameFocus(false)}
                  autoComplete='off'
                />
                <label
                  htmlFor='name'
                  className={
                    isNameFocus || !isNameEmpty
                      ? "modal_input_label_up"
                      : "modal_input_label"
                  }>
                  Block name
                </label>
              </div>

              <div className='__modal_textarea_box'>
                <textarea
                  type='text'
                  placeholder={isDesFocus && "Enter block destails"}
                  className='__block_modal_textares'
                  id='des'
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  onFocus={() => setIsDesFocus(true)}
                  onBlur={() => setIsDesFocus(false)}
                  autoComplete='off'
                />
                <label
                  htmlFor='des'
                  className={
                    isDesFocus || !isDesEmpty
                      ? "modal_input_label_up"
                      : "modal_input_label"
                  }>
                  Block description
                </label>
              </div>
            </div>
          }
        />
      )}
      <NavLink
        activeclassName='active_navlink_blockcast'
        to=''
        className='down_navbar_link'>
        <GrAnnounce className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Block Feed</span>
      </NavLink>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='/group/my-group'
        className='down_navbar_link'>
        <BlockIcon className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>My Block</span>
      </NavLink>

      <button className='down_navbar_link' onClick={() => setOpenModal(true)}>
        <MdCreateNewFolder className='blockcast_down_navbar' />
      </button>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='/group/join-group'
        className='down_navbar_link'>
        <LinkIcon className='blockcast_down_navbar' />
        <br />
        <span className='block_cast_down_text'>Joined Block</span>
      </NavLink>

      <NavLink
        activeclassName='active_navlink_blockcast'
        to='group-search'
        className='down_navbar_link'>
        {/* <SearchIcon className='blockcast_down_navbar' /> */}
        <span class='icon search-v'></span>
        <br />
        <span className='block_cast_down_text'>Search Block</span>
      </NavLink>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
  axisValue: state.page.axisValue,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMyGroups: (data) => dispatch(newMyGroups(data)),
  addNewBlock: (data) => dispatch(addMyBlock(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlockDownNavar);
