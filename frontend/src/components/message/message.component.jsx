import { useContext } from "react";
import { connect } from "react-redux";


 var userLoggedIn;
function Message({ message, nextMessage, lastSenderId, user }) {
    userLoggedIn = user;

    var sender = message.sender;
    var senderName = sender.firstName + " " + sender.lastName;


    var currentSenderId = sender._id;
    var nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

    var isFirst = lastSenderId != currentSenderId;
    var isLast = nextSenderId != currentSenderId;

    var isMine = message.sender._id == userLoggedIn._id;
    var liClassName = isMine ? 'mine' : 'theirs';

    var nameElement = "";

    if(isFirst){
        liClassName += " first";

        if(!isMine){
            nameElement = <span className='senderName'>{senderName}</span>;
        }
    }

    var profileImage = "";
    if(isLast){
        liClassName += " last";
        profileImage = <img src={`http://localhost:5000${sender.profilePic}`} />;
    }

    var imageContainer = "";
    if(!isMine){
        imageContainer = <div className='imageContainer'>
                            {profileImage}
                        </div>;
    }


  return user && <li className={`message ${liClassName}`}>
  {imageContainer}
  <div className='messageContainer'>
      {nameElement}
      <span className='messageBody'>
          {message.content}
      </span>
  </div>
</li>
}

const mapStateToProps = state => ({
    user: state.user.user
  })
  
  
export default connect(mapStateToProps)(Message);
