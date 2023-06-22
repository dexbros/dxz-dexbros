import React from 'react'
import { Link } from "react-router-dom";
import "./Style.css"
const User = ({userData, btn_text, handleClick}) => {
  return (
    <div className='user_list'>
      <div className='list1'>
        <img src={userData.profilePic} className="user_list_profilePic" />
        <span className='listUser_name'>
          {
            userData.displayFirstName ? userData.displayFirstName : userData.firstName
          } {" "}
          {
            userData.displayLastName ? userData.displayLastName : userData.lastName
          }
        </span>
        <span className='listUser_username'>@{userData.handleUn ? userData.handleUn : userData.username}</span>
      </div>
      <button className='user_btn' onClick={() => handleClick(userData._id)}>{btn_text}</button>
    </div>
  )
}

export default User