/** @format */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Multer = require("multer");
const uuid = require("uuid");
const uuidv1 = uuid.v1;
const { Storage } = require("@google-cloud/storage");
const bcrypt = require("bcrypt");
const { query } = require("express");
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const maps = Aerospike.maps;
const exp = Aerospike.exp;
const { getAerospikeClient } = require("../../../aerospike");
const { recordExpression } = require("@babel/types");
const { v4: uuidv4 } = require("uuid");

// const storage = new Storage({
//   projectId: "quiztasy",
//   credentials: {
//     client_email: "dexbros-upload@quiztasy.iam.gserviceaccount.com",
//     private_key:
//       "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxtcYo4lgaK7gh\nV1z3UFRkV2HT28rUjuFKrQrfjEEKkzgZWgwu8V6SzPXPYmGWAFpLtYqgUP28QXoq\nXWCWLYlMcQA2OalnjNiilRy8Yq2Yjj75LPy2rKT8W14Cyr07inZxEWsrs5rS3Ycp\nw3nZnub5dxPXqewrjHPQUx0a5a6UiBDD7YdE1fHAniaxZz18yy9f6nOVWac0m5P2\ntHNgrB+CalwQIf51TCvJrfsPw0hFHHYlTWhA8ATZfPJxAXNLklo/roFr/LmfUnq0\nl1nFPQqTMj5jCOQ8DO5j0zFJvgZ/d0ePN0IOyUxhVH9Qq9oQRh7YqdDcr27Vos4H\nmXkoA36JAgMBAAECggEARyDBUqXdq4PqK/YisJ5HWO4cqsZjNZaGl/QQ0Q77DXeF\nUahYDgXv24QLstjmxDoZ6gmclbQ1Cr+OXRyIxzMsrBrigdGse1TFdLWIDeLVJqVw\nkR0vfRI26wbK5wUsnoM6CuF06sX1ZwbhzZZ+09qlCh5eI8jQTVHnHO/XS2e465uq\nIxMWwGBEy5ZVksWV+/OA+YvQMSMxar0AMvCTf2McoUGw/flxXrg4gnl/brI7p4El\nokYb6MVI38VvlQ87MshosDA4bxSj0IyHXzXHC3vJ4E1Ph1CjbHjtV4YVlLy0qH3K\n41UOEa5OPNSG5rvPAz/oQDjyFw2nuDVGpKRlqGteTQKBgQDy3xvXN7jyVr74r42V\n8H2BtyachzYtESrpLnoM4bHEZ3hzjnGrLSQUMFBleajcs+yCqcvzruW7mG5SNYNU\na7NrzncnGC1SOX5ej4oOOW8/K/cYbpqDP6f3NkKh7Xkb+xcbwuPvB+Sbl1sUNRfB\nyY5iVjr3x7GBo0g62AN52/+bvwKBgQC7UPOX/VoAmIpKXfzR9RX43/JsqIJ9WZdY\nK0ToMwskV2bN71T2u0D0/ryh6R7MeyIF5PgAZSyTFXLrlwm/GFzBXgew/4Hiud0g\n4W/h7UXpCDOWGq/Cik2VbshsCvDiJr05Q9SYEVyOj6702ZkEHNc5p1Jgao4xYKSV\nD3yZqfMXtwKBgAvG+eij0RofTr9sc+czdEKYCQ1KGTxyOqx4Dn8VarNleRfRbn2o\ngLlh5mQlVCTvrKZhaXx1nLpOF/twkN/FITw3FNwWdgwosZIQT9eEvXpIvYC3zFJV\nAeYhAXYst9S9hk9YUglDTrikzEvcjzxcc8Uc/VsKmfb5XgVMeE6udmStAoGAe+4z\nPHwC8CH8XPeSLddZki+Y1QsoSobb+xmlnXsoBANPoTCXpiZ985oWc4kpN2DAQeYb\nrydBNo8aWYS0jhowRD9SF2j1JmySQQ7mVzQE7QjgGI/PeYbHjfad493ZQccfqqOW\nJIZYFno55wWQl4f9Xce2WNQm/8RRH83/QiuPCkECgYEAz9WgZuz9tOF2Nl3qkW4I\naW7ViTE8XiFHMFZIh5LXyER98YUxVVRdNBOJtvlop6KXAIN9g8VzrOHvT34jd057\nEwAO4HDmE71PsdqrwgMCJEYGHhkv/ZXU2Hey0bqV0/ajvkcVN5mHm81j68fdqzB0\niBUDWp6KQ0+9BYstzxlNdbw=\n-----END PRIVATE KEY-----\n",
//   },
// });
// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });
// const bucket = storage.bucket("dexbros_files");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 75 * 1024 * 1024,
  },
});

const mailgun = require("mailgun-js");
var api_key = "880eec1d67de21541e7f90936d8c5d98-d2cc48bc-b7a194a6";
var domain = "sandbox9826fdccdb404038a93ba6ad560ca121.mailgun.org";
var mg = require("mailgun-js")({ apiKey: api_key, domain: domain });

const {
  handleUpdateVisitors,
  updateGender,
  updateLanguage,
  updateCountry,
  updateDisplayName,
  updateAbout,
  updateLink,
  updateProfilePrivacy,
  updateProfileCommentPrivacy,
  updateProfileVisitPrivacy,
  updateUserPassword,
  updateProfileMessagePrivacy,
  updateBirthDay,
  uploadProfilePicture,
  uploadCoverImage,
  fetchFollowersList,
  fetchFollowingList,
  selectInterested,
  updateBio,
  updateLocation,
  hideUser,
  fetchHideUsers,
  unHideUser,
  blockUser,
  unBlockUser,
  updateProfileVisit,
  getProfileAnalytics,
  updatePersonalInfo,
  getSuggestList,
  updateInterest,
  updateInfo,
  suggestions,
  updateName,
  updateHobbies,
  updateProfileInfo,
  handleFollowFollowing,
  verifyProfile,
  verifyKey,
  socialLinks,
  fetchFullProfile,
  gcmBadge,
  ccBadge,
  MBbadge,
  checkBadges,
  fetchSuggestedUser,
  searchUser,
  updateProfileAvatar,
} = require("../../../controller/userController");

/**
 * START
 */
// *** Update visitors count
router.post("/update/visitor/:handleUn", handleUpdateVisitors);
// *** Update profile image with avatar
router.post("/update/avatar", updateProfileAvatar);
// *** Update user gender
router.put("/update/gender", updateGender);

// *** Update user language
router.put("/update/language", updateLanguage);

// *** Update user birthday
router.put("/update/dob", updateBirthDay);

// *** Update user country
router.put("/update/country", updateCountry);

// *** Update user country
router.put("/update/display_name", updateDisplayName);

// *** Update user about
router.put("/update/about", updateAbout);

// *** Update user link
router.put("/update/link", updateLink);

// *** Update user profile follow following privacy
router.put("/update/profile/privacy", updateProfilePrivacy);

// *** Update user post comment privacy
router.put("/update/profile/comment", updateProfileCommentPrivacy);

// *** Update user profile privacy
router.put("/update/profile/visit/privacy", updateProfileVisitPrivacy);

// *** Update user message privacy
router.put("/update/profile/message/privacy", updateProfileMessagePrivacy);

// *** Update account password
router.put("/update/password", updateUserPassword);

// *** Upload profile picture
router.post("/profile/image", multer.single("p_iture"), uploadProfilePicture);

// UPLOAD USER PROFILE COVER IMAGE API
router.post("/cover/image", multer.single("coverPicture"), uploadCoverImage);

// Fetch followers list
router.get("/:handleUn/follower-list", fetchFollowersList);

// Fetch following list
router.get("/:handleUn/following-list", fetchFollowingList);

// Selected interested things
router.put("/:handleUn/update/interest", selectInterested);

// update bio
router.put("/:handleUn/update/bio", updateBio);

// update location
router.put("/:handleUn/update/location", updateLocation);

// Hide user
router.put("/hide-user/:handleUn", hideUser);

router.get("/list/hide/users", fetchHideUsers);

router.put("/unhide-user/:handleUn", unHideUser);

router.put("/block-user/:handleUn", blockUser);

router.put("/unblock-user/:handleUn", unBlockUser);

router.put("/visitors/:profile", updateProfileVisit);

router.get("/analytics/:username", getProfileAnalytics);

router.get("/search/user", searchUser);

router.put("/update/personalInfo/:id", updatePersonalInfo);

router.get("/suggestion/list", getSuggestList);

router.put("/update/interest/:id", updateInterest);

router.get("/update/info/:id", updateInfo);

router.get("/suggestion/:id", suggestions);

router.put("/update/name", updateName);

router.put("/update/hobies", updateHobbies);

router.put("/update/profile/info", updateProfileInfo);

router.put("/follow-following/:handleUn", handleFollowFollowing);

router.post("/verify/profile", verifyProfile);

router.get("/verify/key/:id", verifyKey);

router.post("/social/links", socialLinks);

router.get("/full/profile/:handleUn", fetchFullProfile);

router.put("/badge/gcm", gcmBadge);

router.put("/badge/cc", ccBadge);

router.put("/badge/mb", MBbadge);

router.put("/check/badges", checkBadges);

router.get("/profile/suggested", fetchSuggestedUser);

module.exports = router;
