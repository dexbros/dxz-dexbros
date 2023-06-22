import { useContext } from "react";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';


 var userLoggedIn;
function ChatList({ chatData, user }) {
    userLoggedIn = user;

  var chatName = getChatName(chatData); //TODO
  var latestMessage = getLatestMessage(chatData.latestMessage);
  var image = getChatImageElements(chatData);

  var activeClass = !chatData.latestMessage || chatData.latestMessage.readBy.includes(userLoggedIn._id) ? "" : "active";

  return user && <Link to={`/chat/${chatData._id}`} className={`resultListItem ${activeClass}`}>
      {image}
      <div className='resultsDetailsContainer'>
          <span className='heading ellipsis'>{chatName}</span>
          <span className='subText'>{latestMessage}</span>
      </div>
  </Link>
}

function getLatestMessage(latestMessage){
	if(latestMessage != null && latestMessage != undefined){
		var sender = latestMessage.sender;
		return <>{sender.firstName} {sender.lastName}: {latestMessage.content}</>;
	}

	return 'New Chat';
}

function getChatName(chatData){
    var chatName = chatData.chatName;
    if(!chatName){
        var otherChatUsers = getOtherChatUsers(chatData.users);
        var namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
        chatName = namesArray.join(", ");
    }

    return chatName;
}

function getOtherChatUsers(users){
    if(users.length == 1) return users;

    return users.filter(user => user._id != userLoggedIn._id);
}

function getChatImageElements(chatData){
    var otherChatUsers = getOtherChatUsers(chatData.users);

    var groupChatClass = "";
    var chatImage = getUserChatImageElement(otherChatUsers[0]);
    
    if(otherChatUsers.length > 1){
        groupChatClass = "groupChatImage";
        chatImage = <>{getUserChatImageElement(otherChatUsers[0])} {getUserChatImageElement(otherChatUsers[1])}</>
        //console.log(chatImage);
    }


    return <div className={`resultsImageContainer ${groupChatClass}`}>{chatImage}</div>
}

function getUserChatImageElement(user){
    if(!user || !user.profilePic){
        return alert("User passed into function is is invalid");
    }

    //console.log(user.profilePic)

    return <img src={`http://localhost:5000${user.profilePic}`} alt="User's Profile pic" />;
}

const mapStateToProps = state => ({
    user: state.user.user,
  })
  
  
export default connect(mapStateToProps)(ChatList);
