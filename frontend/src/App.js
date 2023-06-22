/** @format */
import React from "react";
import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import "dexbrosicons/style.css";
import { useSocket, isSocketConnected, socket } from "./socket/socket";
import {
  newNotification,
  updateNotificationCount,
} from "./redux/notification/notification.actions";

// REACT TOASTIFY IMPORT
import "react-toastify/dist/ReactToastify.css";
import CommentsPage from "./pages/BlockCast_Main_Page/Comments";
const DmChats = lazy(() => import("./pages/BlockCast_Main_Page/DmChats"));
import BlockSearch from "./pages/Group/BlockSearch";

const Register = lazy(() => import("./pages/register/register.component"));
const Login = lazy(() => import("./pages/login/login.component"));
const HomePage = lazy(() => import("./pages/home/home.component"));
const TrendingPage = lazy(() => import("./pages/home/Trending"));
const PostAnalytics = lazy(() =>
  import("./pages/post-analytics/PostAnalytics")
);
const ProfileAnalytics = lazy(() =>
  import("./pages/Profile.Analytics/TestAnalytics")
);
const ProfileEdit = lazy(() =>
  import("./pages/profile/ProfileRoutes/EditProfile")
);
const Inbox = lazy(() => import("./pages/inbox/inbox.component"));
const ChatPage = lazy(() => import("./pages/chat/chat.component"));
const SearchPage = lazy(() => import("./pages/search/searchPage.component"));
const MainSearch = lazy(() => import("./pages/search/MainSearch"));
const SearchPost = lazy(() => import("./pages/search/PostSearch"));
const SearchUser = lazy(() => import("./pages/search/SearchUser"));

const NotificationPage = lazy(() =>
  import("./pages/notification/notification.component")
);
const FullPost = lazy(() => import("./pages/Full-Post-View/FullPost"));
const PostLike = lazy(() =>
  import("./pages/Post-Like-Dislike/PostLikeDislike")
);
const NewMessagePage = lazy(() =>
  import("./pages/newMessage/newMessage.component")
);
const MainProfileSettingsPage = lazy(() =>
  import("./pages/ProfileSettings/MainSettings")
);
const UserFollwersFollowing = lazy(() =>
  import("./pages/Following.Followers/FollowingFollowers")
);
const GroupPage = lazy(() => import("./pages/Group/GroupList"));
const RecomemndedGroup = lazy(() => import("./pages/Group/Recomemded"));
const MyGroup = lazy(() => import("./pages/Group/MyGroup"));
const JoinedGroup = lazy(() => import("./pages/Group/JoinedGroup"));

const SingleGroupPage = lazy(() => import("./pages/Group.Comp/Group"));
const SingleGrouupPost = lazy(() =>
  import("./pages/Group.Single.Post/GroupSinglePost")
);
const GroupAnalytics = lazy(() => import("./pages/Group.Comp/GroupAnalytics"));

const SingleGrouupPostAnalytics = lazy(() =>
  import("./pages/GroupPost.Analytics.Page/GroupAnalyticspage")
);
const GroupMembers = lazy(() => import("./pages/Group.Members/GroupMembers"));
const GroupAnalyticsPage = lazy(() =>
  import("./pages/Group.Page.Analytics/GroupPageAnalytics")
);
const GroupEditPage = lazy(() => import("./pages/Group.Edit.Page/GroupEdit"));
const Settings = lazy(() => import("./pages/Settings/Settings"));

const ProfilePost = lazy(() => import("./pages/Profile.Post/ProfilePost"));
const ProfileMentions = lazy(() =>
  import("./pages/profile/ProfileRoutes/MentionsPage")
);
const ProfileFollowerFollowingList = lazy(() =>
  import("./pages/ProfileFollowerFollwingList/ProfileList")
);
const FollowerPage = lazy(() =>
  import("./pages/ProfileFollowerFollwingList/FollowerList")
);
const FollowingPage = lazy(() =>
  import("./pages/ProfileFollowerFollwingList/FollowingList")
);

// const ProfileMedia = lazy(() => import('./pages/ProfileMedia/ProfileMedia'));
const GroupInfo = lazy(() => import("./pages/Group.Comp/GroupInfo"));
const GroupPost = lazy(() => import("./pages/Group.Comp/GroupPost"));
const GroupRecomendation = lazy(() =>
  import("./pages/Group.Comp/GroupRecomendation")
);
const GroupEvent = lazy(() => import("./pages/Group.Comp/GroupEvent"));
const Feed = lazy(() => import("./pages/home/Feed"));
const Activity = lazy(() => import("./pages/home/Activity"));
const News = lazy(() => import("./pages/home/News"));
const UserProfile = lazy(() => import("./pages/profile/TestProfile"));
const AboutProfile = lazy(() => import("./pages/profile/About"));
const GroupPostLike = lazy(() =>
  import("./pages/GroupPost-Like-DisLike/GroupPostLike")
);
const PostComment = lazy(() => import("./pages/Post-Comment/PostComment"));

// *** Block cast
const BlockCast = lazy(() => import("./pages/BlockCast/BlockCast"));
const Recomended = lazy(() => import("./pages/BlockCast/Recomended"));
const Chats = lazy(() => import("./pages/BlockCast/Chats"));
const JoinedBlockCast = lazy(() => import("./pages/BlockCast/JoinedBlockCast"));
const MyBlockCast = lazy(() => import("./pages/BlockCast/MyBlockCast"));

const SingleBlockCast = lazy(() =>
  import("./pages/BlockCast_Main_Page/BlockMain")
);

const SingleBlockCastChat = lazy(() =>
  import("./pages/BlockCast_Main_Page/SingleChat")
);
const SingleChatSettings = lazy(() =>
  import("./pages/BlockCast_Main_Page/SingleChatSettings")
);
const BlockCastMainSetting = lazy(() =>
  import("./pages/BlockCast_Main_Page/Setting")
);
const CastFeed = lazy(() => import("./pages/BlockCast_Main_Page/CastFeed"));
const FullEvent = lazy(() => import("./pages/FullEvent/FullEvent"));

const TrendingPosts = lazy(() => import("./pages/TrendingPosts/TrendingPosts"));

/**
 * Should be solved
 */
// const Verification = lazy(() => import("./pages/Verification/Verification"));
const BadgePage = lazy(() => import("./pages/Badges/Badges"));
const ContentCreator = lazy(() => import("./pages/Badges/ContentCreator"));
const GCM = lazy(() => import("./pages/Badges/GCM"));
const Miners = lazy(() => import("./pages/Badges/Miners"));
const MenuPage = lazy(() => import("./pages/MenuPage/MenuPage"));
const DetailsHistory = lazy(() => import("./pages/EarnHistory/DetailsHistory"));
const FullHistory = lazy(() => import("./pages/EarnHistory/FullHistory"));
const CreateNftPage = lazy(() => import("./pages/Nft/MainPage"));
const NFTForm = lazy(() => import("./pages/Nft/NFTForm"));
const PageNotFound = lazy(() => import("./pages/404Page/PageNotFound"));
const DmMessage = lazy(() => import("./pages/BlockCast_Main_Page/DmMessage"));

const Search = lazy(() => import("./pages/SearchMain/SearchMain"));
const GroupFullPost = lazy(() => import("./pages/GroupFullPost/GroupFullPost"));

// importing single and group chat pages
const Chat = lazy(() => import("./pages/NormalChat/Chat"));

// *** importing group post analytics
const GroupPostAnalyticspage = lazy(() =>
  import("./pages/GroupPost.Analytics.Page/GroupAnalyticspage")
);

import MainLoading from "./pages/MainLoader/MainLoading";

import { setScrollAxis } from "./redux/page/page.actions";

function App({
  user,
  token,
  setScrollAxis,
  newNotification,
  updateNotificationCount,
}) {
  useSocket();
  const location = useLocation();
  const [prevPathName, setPrevPathName] = React.useState("/");

  React.useEffect(() => {
    if (isSocketConnected) {
      socket
        .off("new notification receive")
        .on("new notification receive", (data) => {
          // console.log("new notification receive: ", data);
          newNotification(data.notificationData);
          updateNotificationCount(data.notificationData);
          // if (!data.view) {
          //   setNotificationsCount((prev) => prev + 1);
          // }
        });
    }
  });

  useEffect(() => {
    if (location.pathname !== prevPathName) {
      setPrevPathName(location.pathname);
      console.log("UP");
      setScrollAxis("Up");
    }
  }, [location]);

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    //alert(res.data)
  };

  return (
    <Suspense fallback={<MainLoading />}>
      <Routes>
        <Route
          path='/'
          element={user ? <HomePage /> : <Navigate to='/login' replace />}>
          <Route path='' element={<Feed />} />
          <Route path='activity' element={<Activity />} />
          <Route path='trending' element={<TrendingPage />} />
          <Route path='news' element={<News />} />
        </Route>
        <Route
          path={"/trending/posts/:key"}
          element={user ? <TrendingPosts /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/full/post/view/:id'
          element={user ? <FullPost /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/post/analytics/:id'
          element={user ? <PostAnalytics /> : <Navigate to='/login' replace />}
        />
        {/* NEW USER PROFILE */}
        <Route
          path='/user/profile/:handleUn'
          element={user ? <UserProfile /> : <Navigate to='/login' replace />}>
          <Route path='' element={<ProfilePost />} />
          {/* <Route path='save' element={<ProfileSavePost />} /> */}
          <Route path='mentions' element={<ProfileMentions />} />
          {/* <Route path='analytics' element={<ProfileAnalytics />} /> */}
          <Route path='about' element={<AboutProfile />} />
        </Route>

        <Route
          path='/profile/analytics/:handleUn'
          element={
            user ? <ProfileAnalytics /> : <Navigate to='/login' replace />
          }></Route>

        <Route
          path='/user/profile/follower-following/:handleUn'
          element={
            user ? (
              <ProfileFollowerFollowingList />
            ) : (
              <Navigate to='/login' replace />
            )
          }>
          {/* Follower */}
          <Route path='' element={<FollowerPage />} />
          {/* Following */}
          <Route path='followinglist' element={<FollowingPage />} />
        </Route>
        <Route
          path='/profile/edit/:handleUn'
          element={user ? <ProfileEdit /> : <Navigate to='/login' replace />}
        />
        {/* <Route path="/profile/info/:id" element={user ? <ProfileInfo /> : <Navigate to='/login' replace /> } /> */}
        <Route
          path='/profile/update/:handleUn'
          element={
            user ? (
              <MainProfileSettingsPage />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/analytics/:handleUn'
          element={
            user ? <ProfileAnalytics /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/post/like/:id'
          element={user ? <PostLike /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/post/comment/:id'
          element={user ? <PostComment /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/chat/:id'
          element={user ? <ChatPage /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/login'
          element={user ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/messages'
          element={user ? <Inbox /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/register'
          element={user ? <Navigate to='/' replace /> : <Register />}
        />
        <Route
          path='/search'
          element={user ? <SearchPage /> : <Navigate to='/login' replace />}>
          <Route path='' element={<SearchUser />} />
          <Route path='post' element={<SearchPost />} />
        </Route>

        <Route
          path='/main/search'
          element={
            user ? <MainSearch /> : <Navigate to='/login' replace />
          }></Route>
        <Route
          path='/notifications'
          element={
            user ? <NotificationPage /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/new-message'
          element={user ? <NewMessagePage /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/:handleUn/followeer-following'
          element={
            user ? <UserFollwersFollowing /> : <Navigate to='/login' replace />
          }
        />

        <Route
          path='/group'
          element={user ? <GroupPage /> : <Navigate to='/login' replace />}>
          <Route path='' element={<RecomemndedGroup />} />
          <Route path='my-group' element={<MyGroup />} />
          <Route path='join-group' element={<JoinedGroup />} />
          <Route path='group-search' element={<BlockSearch />} />
        </Route>

        <Route
          path='/group/:id'
          element={
            user ? <SingleGroupPage /> : <Navigate to='/login' replace />
          }>
          <Route path='' element={<GroupInfo />} />
          <Route path='post' element={<GroupPost />} />
          <Route path='event' element={<GroupEvent />} />
        </Route>
        <Route
          path='/group/:id/analytics'
          element={user ? <GroupAnalytics /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/group/single/post/:id'
          element={
            user ? <SingleGrouupPost /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/group/recomend/:id'
          element={
            user ? <GroupRecomendation /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/group/post/analytics/:id'
          element={
            user ? (
              <SingleGrouupPostAnalytics />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
        <Route
          path='/group/members/:id'
          element={user ? <GroupMembers /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/group/analytics/:id'
          element={
            user ? <GroupAnalyticsPage /> : <Navigate to='/login' replace />
          }
        />
        <Route
          path='/group/post/like/:id'
          element={user ? <GroupPostLike /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/group/edit/:id'
          element={user ? <GroupEditPage /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/event/:id'
          element={
            user ? <FullEvent /> : <Navigate to='/login' replace />
          }></Route>
        <Route
          path='/settings'
          element={
            user ? <Settings /> : <Navigate to='/login' replace />
          }></Route>

        {/* BLOCK CAST */}
        <Route
          path='/blockcast'
          element={user ? <BlockCast /> : <Navigate to='/login' replace />}>
          <Route
            path=''
            element={user ? <Recomended /> : <Navigate to='/login' replace />}
          />
          <Route
            path='chats'
            element={user ? <Chats /> : <Navigate to='/login' replace />}
          />
          <Route
            path='join'
            element={
              user ? <JoinedBlockCast /> : <Navigate to='/login' replace />
            }
          />
          <Route
            path='my_blockcast'
            element={user ? <MyBlockCast /> : <Navigate to='/login' replace />}
          />
        </Route>

        <Route
          path='/blockcast/:id'
          element={
            user ? <SingleBlockCast /> : <Navigate to='/login' replace />
          }>
          <Route path='' element={<CastFeed />} />
          <Route path='comments' element={<CommentsPage />} />
          <Route path='dm' element={<DmChats />} />
        </Route>

        {/* Blockcast for single chat */}
        <Route
          path='/blockcast/single/:id'
          element={
            user ? <SingleBlockCastChat /> : <Navigate to='/login' replace />
          }></Route>

        <Route
          path='/blockcast/dm/:id'
          element={
            user ? <DmMessage /> : <Navigate to='/login' replace />
          }></Route>

        {/*  */}
        <Route
          path='/blockcast/single/settings/:id'
          element={
            user ? <SingleChatSettings /> : <Navigate to='/login' replace />
          }></Route>

        <Route
          path='/blockcast/main/settings/:id'
          element={
            user ? <BlockCastMainSetting /> : <Navigate to='/login' replace />
          }></Route>

        {/* <Route
          path='/verify/:id'
          element={user ? <Verification /> : <Navigate to='/login' replace />}
        /> */}

        <Route
          path='/badge'
          element={user ? <BadgePage /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/content_cretor'
          element={user ? <ContentCreator /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/gcm'
          element={user ? <GCM /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/miner'
          element={user ? <Miners /> : <Navigate to='/login' replace />}
        />
        <Route
          path='/menu'
          element={user ? <MenuPage /> : <Navigate to='/login' replace />}
        />

        <Route
          path='/view/full/details/:id'
          element={user ? <DetailsHistory /> : <Navigate to='/login' replace />}
        />

        <Route
          path='/view/history/:id'
          element={user ? <FullHistory /> : <Navigate to='/login' replace />}
        />

        <Route
          path='/post/nft/:id'
          element={user ? <CreateNftPage /> : <Navigate to='/login' replace />}
        />
        {/* NFTForm */}
        <Route
          path='/nft/form'
          element={user ? <NFTForm /> : <Navigate to='/login' replace />}
        />

        {/* Group search */}
        <Route
          path='/search/page'
          element={user ? <Search /> : <Navigate to='/login' replace />}
        />

        <Route
          path='/group/full/post/:id'
          element={user ? <GroupFullPost /> : <Navigate to='/login' replace />}
        />

        {/* Single & group message page */}
        <Route
          path='/normal/chat'
          element={user ? <Chat /> : <Navigate to='/login' replace />}
        />

        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  token: state.user.token,
});

const mapDispatchToProps = (dispatch) => ({
  setErrorMessage: (value) => dispatch(setErrorMessage(value)),
  calculateTotalReturn: () => dispatch(calculateTotalReturn()),
  setScrollAxis: (data) => dispatch(setScrollAxis(data)),
  newNotification: (notification) => dispatch(newNotification(notification)),
  updateNotificationCount: (count) => dispatch(updateNotificationCount(count)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
