/** @format */

import React from "react";
import { connect } from "react-redux";
import Blockcast_List from "../../components/Blockcast_List/Blockcast_List";
import ChatList from "../../components/Blockcast_List/ChatList";
import BlockcastListSkeleton from "../../components/SkeletonLoading/BlockcastListSkeleton";

const JoinedBlockCast = ({ token, blockCast }) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(5);
  const [blockData, setBlockData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const scrollHandler = (e) => {
    // console.log("Scroll");
    let cl = e.currentTarget.clientHeight;
    // console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    // console.log(sy);
    let sh = e.currentTarget.scrollHeight;
    // console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  React.useEffect(() => {
    fetchBlock();
  }, [blockCast]);

  const fetchBlock = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/join?page=${page}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBlockData((prev) => result);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div
      className='block_cast_chats_section'
      onScroll={(e) => scrollHandler(e)}>
      {isLoading ? (
        <BlockcastListSkeleton />
      ) : (
        <>
          {(blockData || []).length > 0 ? (
            <>
              {blockData.map((block) => (
                <Blockcast_List key={block.b_id} data={block} />
              ))}
            </>
          ) : (
            <div className='empty_block_cast'>
              No recomendation has been found
            </div>
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
  blockCast: state.blockCast.blockCast,
});

export default connect(mapStateToProps, null)(JoinedBlockCast);
