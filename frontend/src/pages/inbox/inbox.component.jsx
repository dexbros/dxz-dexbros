/** @format */

import * as React from "react";
import { connect } from "react-redux";

import { setPageType } from "../../redux/page/page.actions";

import MainLayout from "../../layouts/main-layout.component";
import ChatList from "../../components/chatList/chatlist.component";

function InboxPage({ user, token, setPageType }) {
  const [chats, setChats] = React.useState(null);

  React.useLayoutEffect(() => {
    setPageType("social");
  }, []);

  React.useEffect(() => {
    if (user) {
      async function postData(url = "", data = {}) {
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

      postData(`${process.env.REACT_APP_URL_LINK}api/chats`)
        .then((data) => {
          //console.log(data);
          setChats(data);
          //newPosts(data); // JSON data parsed by `data.json()` call
        })
        .catch((err) => console.log(err));
    }
  }, [token, user]);

  return (
    user && (
      <MainLayout>
        <div className='resultsContainer'>
          {chats &&
            chats.map((chat) => {
              return <ChatList key={chat._id} chatData={chat} />;
            })}
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

export default connect(mapStateToProps, mapDispatchToProps)(InboxPage);
