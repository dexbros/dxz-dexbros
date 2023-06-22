/** @format */

import * as React from "react";
import { connect, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { setDrawer, setScrollAxis } from "../redux/page/page.actions";
import { pageTypeSelector } from "../redux/_page/pageSelectors";
// Headers
import DefaultHeader from "../components/Headers/defaultHeader/DefaultHeader";
import SportsHeader from "../components/Headers/sportsHeader/SportsHeader";
import TestHeader from "../components/Headers/socialHeader/TestHeader";
import CryptoHeader from "../components/Headers/cryptoHeader/CryptoHeader";
import QuizHeader from "../components/Headers/quizHeader/QuizHeader";
import BlockCastHeader from "../components/Headers/BlockCastHeader/BlockCastHeader";
import TrendingHeader from "../components/Headers/TrendingHeader/TrendingHeader";
import ProfileHeader from "../components/Headers/ProfileHeader/ProfileHeader";
import BlockHeader from "../components/Headers/BlockHeader/BlockHeader";
import PostAnalytics from "../pages/post-analytics/PostAnalytics";
import SocialPagesHeader from "../components/Headers/SocialPagesHeader/SocialPagesHeader";
import BlockCastSingleChat from "../components/Headers/BlockCastSingleChat/BlockCastSingleChat";

// LeftSideBars
import DefaultLeftSideBar from "../components/LeftSideBars/defaultLeftSidebar/DefaultLeftSideBar";
import SportsLeftSideBar from "../components/LeftSideBars/sportsLeftSideBar/SportsLeftSideBar";
import SocialLeftSideBar from "../components/LeftSideBars/socialLeftSidebar/SocialLeftSideBar";
import CryptoLeftSideBar from "../components/LeftSideBars/cryptoLeftSidebar/CryptoLeftSideBar";
import QuizLeftSideBar from "../components/LeftSideBars/quizLeftSideBar/QuizLeftSideBar";

// RightSideBars
import DefaultRightSideBar from "../components/RightSideBar/DefaultRightSideBar/DefaultRightSideBar";
import SportsRightSideBar from "../components/RightSideBar/SportsRightSideBar/SportsRightSideBar";
import SocialRightSideBar from "../components/RightSideBar/SocialRightSideBar/SocialRightSideBar";
import CryptoRightSideBar from "../components/RightSideBar/CryptoRightSideBar/CryptoRightSideBar";
import QuizRightSideBar from "../components/RightSideBar/QuizRightSideBar/QuizRightSideBar";

// DownNavs
import DefaultDownNav from "../components/DownNav/DefaultDownNav/DefaultDownNav";
import CryptoDownNav from "../components/DownNav/CryptoDownNav/CryptoDownNav";
import SportsDownNav from "../components/DownNav/SportsDownNav/SportsDownNav";
import SocialDownNav from "../components/DownNav/SocialDownNav/SocialDownNav";
import QuizDownNav from "../components/DownNav/QuizDownNav/QuizDownNav";
import Search from "../pages/search/Search";
import SearchForm from "../components/SearchForm/SearchForm";
import MobileSearchForm from "../components/SearchForm/MobileSearchForm";
import BlockEditHeader from "../components/Headers/BlockEdit/BlockEditHeader";
import BlockCastDownNavbar from "../components/DownNav/BlockCastDownNavbar/BlockCastDownNavbar";
import FullPostHeader from "../components/Headers/FullPostHeader/FullPostHeader";
import BadgeHeader from "../components/Headers/Badge/Badge";
import ContentCreatorHeader from "../components/Headers/ContentCreatorHeader/ContentCreatorHeader";
import BlockCastMainHeader from "../components/Headers/BlockCastMainHeader/BlockCastMainHeader";
import BlockDownNavbar from "../components/DownNav/BlockDownNav/BlockDownNavbar";
import BlockMainPage from "../components/Headers/BlockMainPage/BlockMainPage";
import NormalChatHeader from "../components/Headers/NormalChatHeader/NormalChatHeader";

const Header = ({ goBack, menu, members, title }) => {
  const pageType = useSelector(pageTypeSelector);
  console.log("Page Type: ", pageType);
  if (pageType == "social") {
    // return <SocialHeader />
    return <TestHeader goBack={goBack} title={title} />;
  } else if (pageType == "sports") {
    return <SportsHeader />;
  } else if (pageType == "crypto") {
    return <CryptoHeader />;
  } else if (pageType == "quiz") {
    return <QuizHeader goBack={goBack} title={title} />;
  } else if (pageType === "block") {
    return <BlockCastHeader title={title} menu={menu} />;
  } else if (pageType === "trending") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "profile") {
    return <ProfileHeader title={title} />;
  } else if (pageType === "block") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "post_analytics") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "block_edit") {
    return <BlockEditHeader title={title} />;
  } else if (pageType === "full_post_view") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "block_create") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "badge") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "content_creator") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "profile_edit") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "menu") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "settings") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "blockcast") {
    return <BlockCastHeader />;
  } else if (pageType === "block_cast_single") {
    return <BlockCastSingleChat />;
  } else if (pageType === "block_cast_message_settings") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "search") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "blockcast_main_page") {
    return <BlockCastMainHeader />;
  } else if (pageType === "block_page") {
    return <BlockMainPage title={title} />;
  } else if (pageType === "block_setting") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "create_nft") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "block_analytics") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "profile_follwers") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "search_page") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "notification") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "block_full_post") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "profile_settings") {
    return <SocialPagesHeader title={title} />;
  } else if (pageType === "normal_chat") {
    return <NormalChatHeader />;
  } else {
    return <DefaultHeader />;
  }
};

const LeftSideBar = () => {
  const pageType = useSelector((state) => state.page.pageType);
  if (pageType == "social") {
    return <SocialLeftSideBar />;
  } else if (pageType == "sports") {
    return <SportsLeftSideBar />;
  } else if (pageType == "crypto") {
    return <CryptoLeftSideBar />;
  } else if (pageType == "quiz") {
    return <QuizLeftSideBar />;
  } else if (pageType === "block") {
    return <SocialLeftSideBar />;
  } else if (pageType === "trending") {
    return <SocialLeftSideBar />;
  } else if (pageType === "profile") {
    return <SocialLeftSideBar />;
  } else if (pageType === "block") {
    return <SocialLeftSideBar />;
  } else if (pageType === "post_analytics") {
    return <SocialLeftSideBar />;
  } else if (pageType === "block_edit") {
    return <SocialLeftSideBar />;
  } else if (pageType === "blockcast") {
    return <SocialLeftSideBar />;
  } else {
    return <SocialLeftSideBar />;
  }
};

const RightSideBar = () => {
  const pageType = useSelector((state) => state.page.pageType);
  if (pageType == "social") {
    return <SocialRightSideBar />;
  } else if (pageType == "sports") {
    return <SportsRightSideBar />;
  } else if (pageType == "crypto") {
    return <CryptoRightSideBar />;
  } else if (pageType == "quiz") {
    return <QuizRightSideBar />;
  } else {
    return <DefaultRightSideBar />;
  }
};

const DownNav = () => {
  const pageType = useSelector((state) => state.page.pageType);
  if (pageType == "social") {
    return <SocialDownNav />;
  } else if (pageType == "profile") {
    return <SocialDownNav />;
  } else if (pageType == "sports") {
    return <SportsDownNav />;
  } else if (pageType == "crypto") {
    return <CryptoDownNav />;
  } else if (pageType == "quiz") {
    return <QuizDownNav />;
  }

  // **** Block or group
  else if (pageType === "block") {
    return <BlockDownNavbar />;
  } else if (pageType === "block_page") {
    return null;
  } else if (pageType === "block_settings") {
    return <DefaultHeader />;
  }

  // **** Block cast
  else if (pageType === "blockcast") {
    return <BlockCastDownNavbar />;
  } else if (pageType === "block_cast_single") {
    return null;
  } else if (pageType === "blockcast_main_page") {
    return null;
  } else if (pageType === "full_post_view") {
    return null;
  } else if (pageType === "profile_edit") {
    return null;
  } else if (pageType === "post_analytics") {
    return null;
  } else if (pageType === "create_nft") {
    return null;
  } else if (pageType === "block_analytics") {
    return null;
  } else if (pageType === "profile_follwers") {
    return null;
  } else if (pageType === "menu") {
    return null;
  } else if (pageType === "search_page") {
    return null;
  } else if (pageType === "search") {
    return null;
  } else if (pageType === "trending") {
    return null;
  } else if (pageType === "notification") {
    return null;
  } else if (pageType === "block_full_post") {
    return null;
  } else if (pageType === "profile_settings") {
    return null;
  } else if (pageType === "normal_chat") {
    return null;
  } else {
    return <DefaultDownNav />;
  }
};
// block

function MainLayout({
  children,
  user,
  goBack,
  menu,
  setDrawer,
  isOpen,
  openDrawer,
  axisValue,
  title,
  setScrollAxis,
}) {
  const [mobilescrolled, setMobileScrolled] = React.useState(false);

  const { i18n, t } = useTranslation(["common"]);

  React.useEffect(() => {
    if (localStorage.getItem("i18nextLng")?.length > 2) {
      i18next.changeLanguage("en");
    }
  }, []);

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const searchRef = React.useRef();

  // function handleScroll() {
  //   setScrollAxis(window.scrollY);
  // }

  // React.useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  return (
    user && (
      <div className='app'>
        <div className='left_side_header'>
          <LeftSideBar />
        </div>
        <div className='main_container'>
          {isOpen && <Search />}
          <Header goBack={goBack} menu={menu} title={title} />

          {openDrawer && <MobileSearchForm />}

          <div className='app_container'>{children}</div>
          <DownNav />
        </div>
      </div>
    )
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isOpen: state.page.isOpen,
  openDrawer: state.page.openDrawer,
  axisValue: state.page.axisValue,
});

const mapDispatchToProps = (dispatch) => ({
  setDrawer: (data) => dispatch(setDrawer(data)),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
