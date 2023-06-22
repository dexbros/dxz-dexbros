/** @format */

import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Blockcast_List from "../../components/Blockcast_List/Blockcast_List";
import ChatList from "../../components/Blockcast_List/ChatList";

const DmChats = ({ user, token }) => {
  const { id } = useParams();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [blockData, setBlockData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchChats = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/dm/${id}?page=${page}}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        console.log(result);
        setBlockData(result);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    fetchChats();
  }, [page]);

  return (
    <div
      className='block_cast_chats_section'
      onScroll={(e) => scrollHandler(e)}>
      {isLoading ? (
        <>Loading</>
      ) : (
        <>
          {(blockData || []).length > 0 ? (
            <>
              {blockData.map((data) => (
                <ChatList key={data.b_id} data={data} />
              ))}
            </>
          ) : (
            <>No active chat is present</>
          )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
  posts: state.post.posts,
  pinnedPost: state.post.pinnedPost,
});

export default connect(mapStateToProps, null)(DmChats);
