/** @format */

import * as React from "react";
import { connect } from "react-redux";
import {
  useParams,
  Link,
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../layouts/main-layout.component";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import "./Search.css";
import SearchList from "../../components/SearchList/SearchList";
import { AiOutlineSearch } from "react-icons/ai";
import {
  userSearchKey,
  addAll,
  addPeople,
  addBlock,
} from "../../redux/Search/search.actions";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Search from "./Search";
import { selectToken } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";
import { setPageType, setDrawerHandler } from "../../redux/_page/pageSlice";

function SearchPage({
  token,
  setSearchKey,
  setAllSearch,
  setAllSearchPeople,
  setAllSearchBlock,
  allSearchBlock,
  allSearchPeople,
}) {
  const navigate = useNavigate();
  const textbox = React.useRef(null);
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);

  const [search, setSearch] = React.useState("");
  const [tab, setTab] = React.useState("post");
  const [posts, setPosts] = React.useState(null);
  const [users, setUsers] = React.useState(null);
  const [lists, setLists] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(true);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  console.log("reaching here");

  React.useLayoutEffect(() => {
    console.log("Social_search");
    dispatch(setPageType("social_search"));
  }, []);

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
    try {
      const res = await Promise.all([
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/users/search/user?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + isToken,
            },
          }
        ),
        axios.get(
          `${process.env.REACT_APP_URL_LINK}api/group/search/group?search=${search}`,
          {
            headers: {
              Authorization: "Bearer " + isToken,
            },
          }
        ),
      ]);
      const data = res.map((res) => res.data);
      var arr = [...data[0].user, ...data[1].block];
      console.log(data);
      setLoading(false);
      setAllSearchPeople(data[0].user);
      setAllSearchBlock(data[1].block);
      setLists(arr);
      setAllSearch(arr);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleToMain = () => {
    navigate("/main/search");
    setSearchKey(search);
  };

  return (
    <MainLayout goBack={true} title={<HeaderTitle content={"Search"} />}>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        className='search_page_comp'>
        {/* <div className="serach_input_container">
          <input
            type={"search"}
            placeholder="Search something here..."
            className="search_input"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="search_list_container">
            {
              loading ?
                <div className="spinner_loading_container">
                  <ImSpinner2 className="spinner" />
                </div> : <div className="search_card_container">
                  {
                    (lists || []).length > 0 ?
                      <>
                        {
                          lists.map((list, index) => (
                            <SearchList key={index} data={list} />
                          ))
                        }
                        <div className='search_list_card search_more_container' onClick={handleToMain}>
                          Search more with {search}{" "} <AiOutlineSearch className="search_more_icons" />
                        </div>
                      </> :
                      <div className="spinner_loading_container">No result found</div>
                  }
                </div>
            }
          </div>
        </div> */}
        <Search />
      </Drawer>
    </MainLayout>
  );
}
const mapStateToProps = (state) => ({
  token: state.user.token,
  allSearch: state.search.all,
  allSearchPost: state.search.searchposts,
  allSearchBlock: state.search.searchblock,
  allSearchPeople: state.search.people,
  search: state.search.search,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchKey: (data) => dispatch(userSearchKey(data)),
  setAllSearch: (data) => dispatch(addAll(data)),
  setAllSearchPeople: (data) => dispatch(addPeople(data)),
  setAllSearchBlock: (data) => dispatch(addBlock(data)),
});

export default SearchPage;
