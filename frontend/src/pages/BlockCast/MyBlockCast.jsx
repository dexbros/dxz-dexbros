/** @format */

import React from "react";
import { connect } from "react-redux";
import Blockcast_List from "../../components/Blockcast_List/Blockcast_List";
import BlockCastSkeleton from "../../components/SkeletonLoading/BlockCastSkeleton";

const MyBlockCast = ({ token, blockCast }) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [blockData, setBlockData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const scrollHandler = (e) => {
    console.log("Scroll");
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    console.log(sy);
    let sh = e.currentTarget.scrollHeight;
    console.log(sh, cl, sy);
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
  };

  React.useEffect(() => {
    fetchBlock();
  }, [page, blockCast]);

  const fetchBlock = () => {
    setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/myblock?page=${page}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBlockData((prev) => [...prev, ...result]);
        setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div
      className='block_cast_chats_section'
      onScroll={(e) => scrollHandler(e)}>
      {isLoading ? (
        <BlockCastSkeleton />
      ) : (
        <>
          {(blockData || []).length > 0 ? (
            <>
              {blockData.map((block) => (
                <Blockcast_List key={block.b_id} data={block} />
              ))}
            </>
          ) : (
            <>No recomendation has been found</>
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

export default connect(mapStateToProps, null)(MyBlockCast);
