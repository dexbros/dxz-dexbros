/** @format */

import React from "react";
import { connect } from "react-redux";
import {
  newPosts,
  updatePost,
  putPostsLast,
} from "../../redux/post/post.actions";
import { ImSpinner2 } from "react-icons/im";
import { userLogin } from "../../redux/user/user.actions";
import UserListCard from "../UserList.Comp/UserListCard.jsx";
import { selectToken, selectUser } from "../../redux/_user/userSelectors";
import { useSelector, useDispatch } from "react-redux";

const Suggestion = ({ setStep, token, user, login, setOpenFormModal }) => {
  const isToken = useSelector(selectToken);
  const isUser = useSelector(selectUser);

  const [users, setUsers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false);
  const [resultLength, setResultLength] = React.useState(limit);

  /***
   * @Imp function
   */
  const handleUpdateUser = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + isToken);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/users/update/info/${isUser.handleUn}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        login(result.user, result.token);
        setOpenFormModal(false);
      })
      .catch((error) => console.log("error", error));
  };

  // *** Fetch popular suggested users
  React.useEffect(() => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/users/profile/suggested?page=${page}&limit=${limit}`,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setResultLength(response.data.length);
        setUsers((prev) => [...prev, ...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  return (
    <div className='profile_iupdate_container'>
      <div className='update_form_title'>Suggested users</div>
      <div className='form_container'>
        {(users || []).length > 0 && (
          <div className='user_list_container'>
            {users.map((data) => (
              <UserListCard key={data.handleUn} data={data} />
            ))}
          </div>
        )}
      </div>
      <div className='modal_btn_container'>
        <button
          className='next_btn'
          onClick={() => setStep((prev) => prev + 1)}>
          Next
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
});

const mapDispatchToProps = (dispatch) => ({
  newPosts: (posts) => dispatch(newPosts(posts)),
  putPostsLast: (posts) => dispatch(putPostsLast(posts)),
  updatePost: (post) => dispatch(updatePost(post)),
  setPageType: (type) => dispatch(setPageType(type)),
  login: (user, token) => dispatch(userLogin(user, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion);
