/** @format */

import io from "socket.io-client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { store } from "../redux/store";

//import { NotificationContext } from '../context/notification-context';

var ifConnected;
var socket;
var isSocketConnected;
var lastTypingTime;
var chatId;

const useSocket = () => {
  const user = store.getState().user.user;
  const token = store.getState().user.token;
  const dispatch = useDispatch();
  // const putNotifications = notifications => store.dispatch(putNotifications(notifications))

  //const { notifications, putNotifications } = useContext(NotificationContext);

  useEffect(() => {
    if (user && !isSocketConnected) {
      var options = {
        transports: ["websocket"],
        "force new connection": true,
        path: "/socket.io-client",
      };
      socket = io.connect(process.env.REACT_APP_URL_LINK, {
        transports: ["websocket"],
      }); //{ transports: ['websocket'] }
      isSocketConnected = true;
      if (isSocketConnected) {
        socket.emit("setup", user);
        socket.on("connected", () => {
          // console.log("Socket Connected with http://localhost:3100/");
        });
      }
    }
    if (user && isSocketConnected) {
      socket.on("typing", (id) => {
        chatId = id;
        document.getElementById("typingDot").style.display = "flex";
        var container = document.getElementsByClassName("chatMessages");
        var scrollHeight = container[0].scrollHeight;
        container[0].scrollTo(0, scrollHeight);
        lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
          var timeNow = new Date().getTime();
          var timeDiff = timeNow - lastTypingTime;

          if (timeDiff >= timerLength && lastTypingTime) {
            document.getElementById("typingDot").style.display = "none";
            var container = document.getElementsByClassName("chatMessages");
            var scrollHeight = container[0].scrollHeight;
            container[0].scrollTo(0, scrollHeight);
          }
        }, timerLength);
      });

      socket.off("notification recieved").on("notification recieved", () => {
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

        postData(`${process.env.REACT_APP_URL_LINK}/api/notifications`)
          .then((data) => {
            //console.log(data);
            dispatch({
              type: "PUT_NOTIFICATION",
              notifications: data,
            });
          })
          .catch((err) => console.log(err));
      });
    }
  }, [user, token, isSocketConnected, socket]);
};

export { socket, useSocket, isSocketConnected };
