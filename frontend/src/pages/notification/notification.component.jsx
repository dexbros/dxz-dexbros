/** @format */

import * as React from "react";
import MainLayout from "../../layouts/main-layout.component";
import NotificationLoader from "../../components/SkeletonLoading/NotificationLoader";
import NotificationComp from "../../components/NotificationComp/NotificationComp";
import { socket, useSocket, isSocketConnected } from "../../socket/socket";
import { selectToken } from "../../redux/_user/userSelectors";
import { selectNotifications } from "../../redux/_notification/notificationSelectors";
import { useSelector, useDispatch } from "react-redux";
import { setPageType } from "../../redux/_page/pageSlice";
import { fetchNotifications } from "../../redux/_notification/notificationSlice";

function NotificationPage() {
  const dispatch = useDispatch();
  const isToken = useSelector(selectToken);
  const notifications = useSelector(selectNotifications);
  useSocket();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(50);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    dispatch(setPageType("notification"));
  }, []);

  const fetchNotification = () => {
    setIsLoading(true);
    var axios = require("axios");
    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_URL_LINK}api/notifications?page=${page}&limit=${limit}`,
      headers: {
        Authorization: "Bearer " + isToken,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log("Notification: ", response.data);
        setIsLoading(false);
        dispatch(putNotifications(response.data));
        // putNotifications(response.data);
        // setNotificationsData((prev) => [...prev, ...response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
    socket.on("like notification", (data) => {
      console.log("Noti receive", data);
    });
  };

  React.useEffect(() => {
    setIsLoading(true);
    const data = { page, limit, isToken };
    dispatch(fetchNotifications(data));
    setIsLoading(false);
  }, []);

  return (
    <MainLayout title='Notifications'>
      {isLoading ? (
        <NotificationLoader />
      ) : (
        <>
          {(notifications || []).length > 0 ? (
            <div className='notification_page'>
              {notifications.map((data) => (
                <NotificationComp key={data.id} data={data} />
              ))}
            </div>
          ) : (
            <div className='empty_notification_page'>
              No active notification is present
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default NotificationPage;
