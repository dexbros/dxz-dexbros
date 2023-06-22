/** @format */

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
} from "../../../redux/Search/search.actions";
import { setMobileDrawer } from "../../../redux/page/page.actions";
import UserAvatar from "../../../Assets/userAvatar.webp";
import { BiMenu, BiArrowBack } from "react-icons/bi";

import CustomPostForm from "../../modal/CustomPostForm";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import BlockSekeletonLoader from "../../SkeletonLoading/BlockSekeletonLoader";
import BlockSearchList from "../../SearchList/BlockSearchList";
import MenuComp from "./MenuComp";

import { selectUser, selectToken } from "../../../redux/_user/userSelectors";
import { scrollAxis } from "../../../redux/_page/pageSelectors";
import { useDispatch, useSelector } from "react-redux";

let useClickOutside = (handler) => {
  let domNode = React.useRef();

  React.useEffect(() => {
    let maybeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const BlockCastHeader = () => {
  const dispatch = useDispatch();
  const axisValue = useSelector(scrollAxis);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = React.useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [lists, setLists] = React.useState([]);

  const handlePreviousPage = () => {
    navigate(-1);
  };

  React.useEffect(() => {
    console.log("openMenu useEffect:", openMenu);
  }, [openMenu]);

  let domNode = useClickOutside(() => {
    // setOpenMenu(false);
    setOpenNotificationMenu(false);
  });

  const fetchNotification = () => {
    var axios = require("axios");

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/notifications/fetch/notification/count`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        setCount(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  React.useEffect(() => {
    fetchNotification();
  }, []);

  const onClose = () => {
    setOpenSearchModal(false);
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
          setLists(response.data.block);
          console.log(response.data.block);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
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
                    {(lists || []).length > 0 ? (
                      <>
                        {lists.map((data) => (
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
      <div
        className={
          axisValue === "Up"
            ? "mobile_navbar_section"
            : "hidden_mobile_navbar_section"
        }>
        {/* Logo Section */}
        <div>
          <button className='back_btn' onClick={handlePreviousPage}>
            <BiArrowBack />
          </button>
        </div>

        {/* Other menu */}
        <div className='__other_menu_section' ref={domNode}>
          {/* Search icon */}
          <button
            className='navbar_icon_btn'
            onClick={() => navigate(`/search/page`)}>
            <span class='icon-search_iv'></span>
          </button>

          {/* Message icon */}
          <button className='navbar_icon_btn'>
            <span class='icon-message_four'></span>
          </button>

          {/* Profile menu */}
          <div className='profile_menu' onClick={() => setOpenMenu(true)}>
            <img
              src={
                user.p_i
                  ? `${process.env.REACT_APP_GOOGLE_CLOUD_IMAGE_LINK}${user.p_i}`
                  : UserAvatar
              }
              className='avatar_menu_btn'
            />
            <BiMenu className='profile_menu_icon' />
          </div>
        </div>
      </div>
      {openMenu && (
        <div className='menu_component'>
          <MenuComp setOpenMenu={setOpenMenu} />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
  user: state.user.user,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
  openDrawer: state.page.openDrawer,
  axisValue: state.page.axisValue,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
  setMobileDrawer: (data) => dispatch(setMobileDrawer(data)),
});
export default BlockCastHeader;
