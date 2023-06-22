/** @format */

import React from "react";
import { connect } from "react-redux";
import { setScrollAxis } from "../../redux/page/page.actions";
import BlockCastSkeleton from "../../components/SkeletonLoading/BlockCastSkeleton";
import Blockcast_List from "../../components/Blockcast_List/Blockcast_List";

const Recomended = ({ user, token, setScrollAxis }) => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [blockData, setBlockData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [prevScrollDirection, setPrevScrollDirection] = React.useState(0);

  const handleScroll = (e) => {
    let cl = e.currentTarget.clientHeight;
    console.log(e.currentTarget.clientHeight);
    let sy = Math.round(e.currentTarget.scrollTop);
    let sh = e.currentTarget.scrollHeight;
    if (cl + sy + 1 >= sh) {
      setPage((page) => page + 1);
    }
    console.log(e.target.scrollTop);
    setScrollAxis(e.target.scrollTop);

    const currentScrollPos = e.target.scrollTop;
    // console.log(e.target.scrollTop);
    if (prevScrollDirection < currentScrollPos) {
      // setScrollDirection('down');
      console.log("Down");
      setScrollAxis("Down");
    } else {
      // setScrollDirection("up");
      // console.log("up");
      setScrollAxis("Up");
    }
    setPrevScrollDirection(currentScrollPos);
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  React.useEffect(() => {
    fetchBlock();
  }, [page]);

  const fetchBlock = () => {
    // setIsLoading(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_URL_LINK}api/blockcast/recomended?page=${page}&limit=${limit}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setBlockData((prev) => [...prev, ...result]);
        // setIsLoading(false);
      })
      .catch((error) => console.log("error", error));
  };

  React.useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div
      className='recomended_page_container'
      onScroll={(e) => handleScroll(e)}>
      {isLoading ? (
        <BlockCastSkeleton />
      ) : (
        <div>
          {(blockData || []).length > 0 ? (
            <>
              {blockData.map((block) => (
                <Blockcast_List key={block.b_id} data={block} />
              ))}
            </>
          ) : (
            <div className='empty_blockcast'>No recomendation found</div>
          )}
        </div>
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
const mapDispatchToProps = (dispatch) => ({
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recomended);
