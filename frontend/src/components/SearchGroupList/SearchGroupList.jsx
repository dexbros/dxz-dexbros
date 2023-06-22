import React from 'react';
import { CgSpinner } from 'react-icons/cg';
import "./SearchGroupList.css";
import { ImSpinner2 } from "react-icons/im";
import { NavLink, useNavigate } from 'react-router-dom';

const SearchGroupList = ({ groupData, token, user }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  // const handleClick = (id, handleUn, event) => {
  //   if (event.currentTarget.id === 'join') {
  //     addUserToGroup(id, handleUn);
  //   } else {
  //     navigate(`/group/${groupData.b_id}`)
  //   }
  // }

  // 

  const handleRedirect = (e, id) => {
    e.stopPropagation();
    // console.log("Outer")
    navigate(`/group/${id}`)
  }

  const addUserToGroup = (id, handleUn) => {
    setIsLoading(true)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "groupId": id,
      "userDisplayUsername": handleUn
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_URL_LINK}api/group/join/group`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        setIsLoading(false);
        // setPinnedPost(result);
      })
      .catch(error => console.log('error', error));
  };

  const handleClick = (e, id, handleUn) => {
    if (e.target.id === 'join') {
      console.log("Join");
      addUserToGroup(id, handleUn)
    } else {
      handleRedirect(e, id)
    }
  }


  return (
    <div className='search_group_list' onClick={(e) => handleClick(e, groupData.b_id, user.handleUn)}>
      <div className='search_group_box1'>
        <span className='block_name'>{groupData.b_n}</span>
        <div className='block_type_tag'>{groupData.b_t}</div>
      </div>
      {
        groupData.g_c_dun !== user.handleUn &&
        <button className='block_join_btn' id="join">
        {
          isLoading ? <ImSpinner2 /> : <>Join</>
        }
      </button>
      }
    </div>
  )
};

export default SearchGroupList;

//  onClick={() => addUserToGroup(groupData.b_id, user.handleUn)}