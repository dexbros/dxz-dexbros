/** @format */

import React from "react";
import { AiFillLike, AiOutlineUser } from "react-icons/ai";
import { IoShareSocialSharp } from "react-icons/io5";
import { BiCommentAdd } from "react-icons/bi";
import LikeCount from "./Counts/LikeCount";
import CommentCount from "./Counts/CommentCount";
import ShareCount from "./Counts/ShareCount";
import LikeGraph from "./Graph/LikeGraph";
import ShareGraph from "./Graph/ShareGraph";
import CommentGraph from "./Graph/CommentGraph";
import ImpressionCount from "./Counts/ImpressionCount";
import UniqueViewsCount from "./Counts/UniqueViews";
import ProfileViewsCount from "./Counts/ProfileViewsCount";
import EngagementCount from "./Counts/EngagementCount";
import { FaHandSparkles } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import ImpressionGraph from "./Graph/ImpressionGraph";
import UniqueViewGraph from "./Graph/UniqueViewGraph";
import ProfileViewGraph from "./Graph/ProfileViewGraph";
import EngagementGraph from "./Graph/EngagementGrph";

const Overall = () => {
  const [selectValue, setSelectValue] = React.useState("like");
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(4);
  const buttonData = [
    {
      icon: <AiFillLike />,
      value: "like",
      activeClass: "analytics_inner_tab like_analytics_btn",
      deactiveclass: "analytics_inner_tab share_analytics_btn_outline",
    },
    {
      icon: <IoShareSocialSharp />,
      value: "share",
      activeClass: "analytics_inner_tab share_analytics_btn",
      deactiveclass: "analytics_inner_tab share_analytics_btn_outline",
    },
    {
      icon: <BiCommentAdd />,
      value: "comment",
      activeClass: "analytics_inner_tab comment_analytics_btn",
      deactiveclass: "analytics_inner_tab comment_analytics_btn_outline",
    },

    {
      icon: <FaHandSparkles />,
      value: "impression",
      activeClass: "analytics_inner_tab impression_analytics_btn",
      deactiveclass: "analytics_inner_tab impression_analytics_btn_outline",
    },

    {
      icon: <GrView />,
      value: "unique_view",
      activeClass: "analytics_inner_tab views_analytics_btn",
      deactiveclass: "analytics_inner_tab views_analytics_btn_outline",
    },

    {
      icon: <AiOutlineUser />,
      value: "profile_visit",
      activeClass: "analytics_inner_tab profile_analytics_btn",
      deactiveclass: "analytics_inner_tab profile_analytics_btn_outline",
    },
    {
      icon: <FaHandSparkles />,
      value: "engagement",
      activeClass: "analytics_inner_tab engagement_analytics_btn",
      deactiveclass: "analytics_inner_tab engagement_analytics_btn_outline",
    },
  ];

  const handleIncrementSlice = () => {
    setStart(end);
    setEnd(buttonData.length + 1);
    setSelectValue("unique_view");
  };

  const handleDecrementSlice = () => {
    setEnd(start);
    setStart(0);
    setSelectValue("like");
  };
  return (
    <div className='analytics_info_container'>
      {/* Graph */}
      <div className='analytics_graph'>
        {selectValue === "like" ? (
          <LikeGraph />
        ) : (
          <>
            {selectValue === "share" ? (
              <ShareGraph />
            ) : (
              <>
                {selectValue === "comment" ? (
                  <CommentGraph />
                ) : (
                  <>
                    {selectValue === "impression" ? (
                      <ImpressionGraph />
                    ) : (
                      <>
                        {selectValue === "unique_view" ? (
                          <UniqueViewGraph />
                        ) : (
                          <>
                            {selectValue === "profile_visit" ? (
                              <ProfileViewGraph />
                            ) : (
                              <EngagementGraph />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Tab */}
      <div className='analytics_inner_tab_section'>
        {start !== 0 && (
          <button onClick={handleDecrementSlice}>
            <BsArrowLeft />
          </button>
        )}

        {buttonData.slice(start, end).map((data) => (
          <button
            className={
              selectValue === data.value ? data.activeClass : data.deactiveclass
            }
            onClick={() => setSelectValue(data.value)}>
            {data.icon}
          </button>
        ))}
        {end <= buttonData.length && (
          <button onClick={handleIncrementSlice}>
            <BsArrowRight />
          </button>
        )}
      </div>

      {/* Text analytics */}
      {selectValue === "like" ? (
        <LikeCount />
      ) : (
        <>
          {selectValue === "share" ? (
            <ShareCount />
          ) : (
            <>
              {selectValue === "comment" ? (
                <CommentCount />
              ) : (
                <>
                  {selectValue === "impression" ? (
                    <ImpressionCount />
                  ) : (
                    <>
                      {selectValue === "unique_view" ? (
                        <UniqueViewsCount />
                      ) : (
                        <>
                          {selectValue === "profile_visit" ? (
                            <ProfileViewsCount />
                          ) : (
                            <EngagementCount />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Overall;
