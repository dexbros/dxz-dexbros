/** @format */

import * as React from "react";
import { connect } from "react-redux";

import { useParams } from "react-router-dom";

import { useSocket, socket, isSocketConnected } from "../../socket/socket";

import { setPageType } from "../../redux/page/page.actions";

import MainLayout from "../../layouts/main-layout.component";
import Message from "../../components/message/message.component";

var lastTypingTime;

function ChatPage({ user, token, setPageType }) {
  useSocket();

  const id = useParams().id;

  const [chatName, setChatName] = React.useState(null);
  const [messages, setMessages] = React.useState(null);
  const [isChatNameModalOpen, setChatNameModalOpen] = React.useState(false);
  const [newChatName, setNewChatName] = React.useState("");
  const [chatMessage, setChatMessage] = React.useState("");

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  React.useEffect(() => {
    if (user) {
      if (isSocketConnected) {
        socket.emit("join room", id);
        socket.off("message recieved").on("message recieved", (newMessage) => {
          newMessage = JSON.parse(newMessage);
          if (newMessage.chat._id == id) {
            document.getElementById("typingDot").style.display = "none";
            setMessages((prevMessages) => {
              var oldmsg = prevMessages.filter(
                (msg) => msg._id != newMessage._id
              );
              return [...oldmsg, newMessage];
            });
            var container = document.getElementsByClassName("chatMessages");
            var scrollHeight = container[0].scrollHeight;
            container[0].scrollTo(0, scrollHeight, { behavior: "smooth" });
          }
        });
      }

      async function postData(url = "") {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            Authorization: "Bearer " + token,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      postData(`http://localhost:5000/api/chats/${id}`)
        .then((data) => {
          //console.log(data);
          setChatName(getChatName(data));
          //setMessages(data);
          //newPosts(data); // JSON data parsed by `data.json()` call
        })
        .catch((err) => console.log(err));
    }
  }, [token, user, id, isSocketConnected]);

  React.useEffect(() => {
    if (user) {
      async function postData(url = "") {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            Authorization: "Bearer " + token,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      postData(`http://localhost:5000/api/chats/${id}/messages`)
        .then((data) => {
          //console.log(data);
          setMessages(data);
          var container = document.getElementsByClassName("chatMessages");
          var scrollHeight = container[0].scrollHeight;
          container[0].scrollTo(0, scrollHeight);
          //newPosts(data); // JSON data parsed by `data.json()` call
        })
        .catch((err) => console.log(err));
    }
  }, [token, user, id]);

  React.useEffect(() => {
    if (user) {
      async function postData(url = "") {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            Authorization: "Bearer " + token,
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          // body data type must match "Content-Type" header
        });
        //return response.json(); // parses JSON response into native JavaScript objects
      }

      postData(`http://localhost:5000/api/chats/${id}/messages/markAsRead`)
        .then(() => {
          //console.log(data);
          //   setMessages(data);
          //   var container = document.getElementsByClassName("chatMessages");
          //   var scrollHeight = container[0].scrollHeight;
          //   container[0].scrollTo(0,scrollHeight)
          //newPosts(data); // JSON data parsed by `data.json()` call
        })
        .catch((err) => console.log(err));
    }
  }, [token, user, id]);

  function getChatName(chatData) {
    var chatName = chatData.chatName;
    if (!chatName) {
      var otherChatUsers = getOtherChatUsers(chatData.users);
      var namesArray = otherChatUsers.map(
        (user) => user.firstName + " " + user.lastName
      );
      chatName = namesArray.join(", ");
    }

    return chatName;
  }

  function getOtherChatUsers(users) {
    if (users.length == 1) return users;

    return users.filter((u) => u._id != user._id);
  }

  const handleChatNameChange = () => {
    if (newChatName.trim() !== "") {
      async function postData(url = "", data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      postData("http://localhost:5000/api/chats/" + id, {
        chatName: newChatName,
      })
        .then((data) => {
          //setValue("");
          setNewChatName("");
          setChatNameModalOpen(false);
          setChatName(getChatName(data));
          //putPosts([data]);// JSON data parsed by `data.json()` call
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim() !== "") {
      sendMessage();
      return;
    }
  };

  const sendMessageWithKey = (event) => {
    if (chatMessage.trim() !== "" && event.which == 13) {
      sendMessage();
      return;
    }
  };

  const sendMessage = () => {
    var message = chatMessage;
    setChatMessage("");
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }, // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData("http://localhost:5000/api/messages", {
      content: message,
      chatId: id,
    })
      .then((data) => {
        //console.log(data);
        socket.emit("new message", JSON.stringify(data));
        setMessages((prevMessages) => [...prevMessages, data]);
        var container = document.getElementsByClassName("chatMessages");
        var scrollHeight = container[0].scrollHeight;
        container[0].scrollTo(0, scrollHeight, { behavior: "smooth" });
      })
      .catch((err) => {
        setChatMessage(message);
        alert("Some error occured. Please try again.");
        console.log(err);
      });
  };
  const setaNewChatName = (event) => {
    const value = event.target.value;
    setNewChatName(value);
  };
  const handleChat = (event) => {
    const value = event.target.value;
    setChatMessage(value);
    socket.emit("typing", id);
  };

  return (
    user && (
      <MainLayout>
        {isChatNameModalOpen && (
          <Modal
            show={isChatNameModalOpen}
            onCancel={() => setChatNameModalOpen(false)}
            header={"Change Chat Name"}
            footer={
              <>
                <button
                  onClick={() => setChatNameModalOpen(false)}
                  className='btn btn-lg btn-danger'>
                  Close
                </button>
                <button
                  onClick={handleChatNameChange}
                  className='btn btn-lg btn-primary'>
                  Save
                </button>
              </>
            }>
            <input
              type='text'
              id='chatNameTextbox'
              placeholder='Enter a name for this chat'
              value={newChatName}
              onChange={setaNewChatName}
            />
          </Modal>
        )}
        <div className='chatPageContainer'>
          <div className='chatTitleBarContainer'>
            {chatName && (
              <span id='chatName' onClick={() => setChatNameModalOpen(true)}>
                {chatName}
              </span>
            )}
          </div>
          <div className='mainContentContainer'>
            <div className='chatContainer'>
              <ul className='chatMessages'>
                {messages &&
                  messages.map((message, index) => {
                    return (
                      <Message
                        key={message._id}
                        message={message}
                        nextMessage={messages[index + 1]}
                        lastSenderId={message.sender._id}
                      />
                    );
                  })}
                <div className='typingDots' id='typingDot'>
                  <img src='http://localhost:5000/images/dots.gif' />
                </div>
              </ul>
              <div className='footer'>
                <textarea
                  name=''
                  id=''
                  className='inputTextbox'
                  value={chatMessage}
                  onChange={handleChat}
                  onKeyDown={sendMessageWithKey}
                />
                <button
                  className='sendMessageButton'
                  onClick={handleSendMessage}>
                  <i className='fas fa-paper-plane'></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPageType: (pageType) => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
