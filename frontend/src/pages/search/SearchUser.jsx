/** @format */

import * as React from "react";
import { connect } from "react-redux";
import { useParams, Link, Outlet, NavLink } from "react-router-dom";
import { setPageType } from "../../redux/page/page.actions";

const SearchUser = ({ token, setPageType }) => {
  const [users, setUsers] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const searchUser = (e) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "http://localhost:5000/api/users/user-search?search=" + search,
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // setUsers(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className='searchUser_container'>
      <input
        type='serach'
        placeholder='Search user by username'
        className='search_input'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => searchUser(e)}
      />

      <div>Search user</div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);
