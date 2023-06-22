/** @format */

import React from "react";
import Layout from "../../layouts/main-layout.component";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineCreate } from "react-icons/md";
import CryptoData from "../../data/crypto.json";
import CustomModal from "../../components/modal/CustomModal";
import { newMyGroups, addMyBlock } from "../../redux/Group/group.actions";
import { IoMdCreate } from "react-icons/io";
import CustomPostForm from "../../components/modal/CustomPostForm";
import { BiArrowBack } from "react-icons/bi";
import { SiBlockchaindotcom } from "react-icons/si";

import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import BlockSekeletonLoader from "../../components/SkeletonLoading/BlockSekeletonLoader";
import BlockSearchList from "../../components/SearchList/BlockSearchList";
import ManageBlock from "../home/ManageBlock";
import Recomended from "./Recomemded";
import MyGroup from "./MyGroup";
import JoinedGroup from "./JoinedGroup";

import { setPageType } from "../../redux/_page/pageSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectToken } from "../../redux/_user/userSelectors";
import {
  handleCreateNewBlock,
  appendMyBlock,
} from "../../redux/_block/blockSlice";

const GroupList = ({ addNewBlock }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
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

  // handle name
  const [handlename, setHandlename] = React.useState("");
  const [isHandlenameFocus, setIsHandlenameFocus] = React.useState(false);
  const [isHandlenameEmpty, setIsHandlenameEmpty] = React.useState(true);

  // description
  const [description, setDescription] = React.useState("");
  const [isDesFocus, setIsDesFocus] = React.useState(false);
  const [isDesEmpty, setIsDesEmpty] = React.useState(true);

  const [openModal, setOpenModal] = React.useState(false);
  const [isDesVisible, setIsDesVisible] = React.useState(false);
  const [accountType, setAccountType] = React.useState("business");
  const [isDisable, setIsDisable] = React.useState(true);
  const [catVisible, setCatVisible] = React.useState(false);
  const [isVisibleMenu, setsVisibleMenu] = React.useState(false);
  const [lists, setLists] = React.useState([]);
  const [searchList, setSearchList] = React.useState();

  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [groupLists, setGroupLists] = React.useState([]);
  const [activeState, setActiveState] = React.useState("reco");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    dispatch(setPageType("block"));
  }, []);

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
    if (!name.trim() || !description.trim()) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [name, description]);

  // *** Handle block create api
  const createGroup = async () => {
    setIsLoading(true);
    const data = {
      token: token,
      handlename: handlename,
      name: name,
      body: description,
      type: type,
      accountType: accountType,
      symbol: symbol,
    };
    const result = await dispatch(handleCreateNewBlock(data));
    dispatch(appendMyBlock(result.data.group));
    console.log(result);
    setIsLoading(false);
    setName("");
    setHandlename("");
    setDescription("");
    setType("");
    setAccountType("normal");
    setIsLoading(false);
    setIsDisable(true);
    setOpenModal(false);

    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer " + token);
    // myHeaders.append("Content-Type", "application/json");

    // var raw = JSON.stringify();

    // var requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: "follow",
    // };

    // fetch(`${process.env.REACT_APP_URL_LINK}api/group`, requestOptions)
    //   .then((response) => response.json())
    //   .then((result) => {
    //     console.log(result);
    //     addNewBlock(result.group);
    //     setIsLoading(false);
    //     setOpenModal(false);
    //     setName("");
    //     setHandlename("");
    //     setDescription("");
    //     setType("");
    //     setAccountType("normal");
    //     setIsLoading(false);
    //     setIsDisable(true);
    //   })
    //   .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/fetch/crypto`, requestOptions)
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
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setsVisibleMenu(false);
        setIsTypeFocus(false);
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
    if (!handlename.trim()) {
      setIsHandlenameEmpty(true);
    } else {
      setIsHandlenameEmpty(false);
    }
  }, [handlename]);

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

  React.useEffect(() => {
    if (search.length === 2) {
      setLoading(true);
      handleSearchGroup(search);
    } else if (search.length > 2) {
      setLoading(true);
      const delayCall = setTimeout(() => {
        handleSearchGroup(search);
      }, 1000);

      return () => clearTimeout(delayCall);
    }
  }, [search]);

  const handleSearchGroup = async (search) => {
    setLoading(true);
    if (search.trim()) {
      axios
        .get(
          `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((response) => {
          setLoading(false);
          setGroupLists(response.data.block);
          console.log(response.data.block);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onClose = () => {
    setOpenSearchModal(false);
    setOpenModal(false);
    setName("");
    setDescription("");
    setLists([]);
    setType("");
    setSymbol("");
  };

  return (
    <Layout goBack={true} title={"Block"}>
      {openModal && (
        <CustomPostForm
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
                  <div className='drop_menu' ref={menuRef}>
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

              {/* Block handle name */}
              <div className='modal_input_box'>
                <input
                  type='text'
                  placeholder={isNameFocus && "Enter block handle name"}
                  className='block_modal_input'
                  id='handlename'
                  value={handlename}
                  onChange={(e) => setHandlename(e.target.value.slice(0, 50))}
                  onFocus={() => setIsHandlenameFocus(true)}
                  onBlur={() => setIsHandlenameFocus(false)}
                  autoComplete='off'
                />
                <label
                  htmlFor='handlename'
                  className={
                    isHandlenameFocus || !isHandlenameEmpty
                      ? "modal_input_label_up"
                      : "modal_input_label"
                  }>
                  Block handle name
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

      {openSearchModal && (
        <CustomPostForm
          onClose={onClose}
          title={
            <div className='block_search_title_section'>
              <button className='back_btn' onClick={onClose}>
                <BiArrowBack />
              </button>
              <span className='block_search_title_text'>Block search</span>
            </div>
          }
          body={
            <div className='block_search_body'>
              <div className='block_search_form_section'>
                <AiOutlineSearch className='block_search_icon' />
                <input
                  type='search'
                  className='block_search_input'
                  placeholder='Search block'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className='search_list_section'>
                {loading ? (
                  <BlockSekeletonLoader />
                ) : (
                  <>
                    {(groupLists || []).length > 0 ? (
                      <>
                        {groupLists.map((data) => (
                          <BlockSearchList key={data.b_id} blockData={data} />
                        ))}
                      </>
                    ) : (
                      <div className='empty_block_search'>No block found</div>
                    )}
                  </>
                )}
              </div>
            </div>
          }
        />
      )}

      <div className='block_container'>
        {/* Create block button */}
        <button
          className='block_create_button'
          onClick={() => setOpenModal(true)}>
          <MdOutlineCreate />
        </button>

        <button
          className='block_create_floating_btn'
          onClick={() => setOpenModal(true)}>
          <IoMdCreate />
        </button>

        <ManageBlock />

        <div className='block_nested_route_container'>
          <button
            className={
              activeState === "reco"
                ? "netsetd_tab_btn active_netsetd_tab_btn"
                : "netsetd_tab_btn"
            }
            onClick={() => setActiveState("reco")}>
            Recomended
          </button>
          <button
            className={
              activeState === "my_block"
                ? "netsetd_tab_btn active_netsetd_tab_btn"
                : "netsetd_tab_btn"
            }
            onClick={() => setActiveState("my_block")}>
            My Block
          </button>
          <button
            className={
              activeState === "join"
                ? "netsetd_tab_btn active_netsetd_tab_btn"
                : "netsetd_tab_btn"
            }
            onClick={() => setActiveState("join")}>
            Join
          </button>
          <button
            className='netsetd_tab_btn'
            onClick={() => setOpenSearchModal(true)}>
            Search
          </button>
        </div>

        <div className='block_section_container'>
          {activeState === "reco" ? (
            <Recomended activeState={activeState} />
          ) : (
            <>
              {activeState === "my_block" ? (
                <MyGroup activeState={activeState} />
              ) : (
                <>
                  {activeState === "join" ? (
                    <JoinedGroup activeState={activeState} />
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  newMyGroups: (data) => dispatch(newMyGroups(data)),
  addNewBlock: (data) => dispatch(addMyBlock(data)),
});

export default GroupList;
