/** @format */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const Multer = require("multer");
const uuid = require("uuid");
const uuidv1 = uuid.v1;
const { Storage } = require("@google-cloud/storage");
const apiip = require("apiip.net")("28052519-acc6-412a-8469-961eca613fbe");

const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../../../../aerospike");
const { group } = require("console");
const maps = Aerospike.maps;
const exp = Aerospike.exp;
const now = require("nano-time");
const batchType = Aerospike.batchType;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const {
  updateJoinPrivacy,
  updatePostPrivacy,
  updatecreateEventPrivacy,
  updatecreateDMPrivacy,
  updateBlockDetailsPrivacy,
  updateBlockMembersListPrivacy,
  createBlock,
  updateBlockcastName,
  updateBlockcastBio,
  blockRecomendation,
  fetchAllRecomendedGroup,
  fetchMyBlocks,
  fetchJoinBlock,
  fetchSingleBlock,
  fetchBlockAnalytics,
  uploadCoverImage,
  joinBlock,
  joinAsAdmin,
  addToHide,
  removeFromGroupMember,
  blockProfilePicture,
  unFollowGroup,
  followGroup,
  fetchMembers,
  pinnedGroup,
  deleteBlock,
  searchBlock,
  blockNameUpdate,
  updateBlockBio,
  blockCatagoryList,
  updateBlockName,
  fetchBlockMembers,
  fetchAdmins,
  removeFromAdmin,
  fetchHideUsers,
  addToVisitors,
  updateBlockBioDetails,
  addGroupAdmin,
} = require("../../../../controller/blockController");

/**
 * @START
 */
router.post("/", createBlock);
router.put("/update/block/join/:id", updateJoinPrivacy);
router.put("/update/post/:id", updatePostPrivacy);
router.put("/update/create/event/:id", updatecreateEventPrivacy);
router.put("/update/dm/privacy/:id", updatecreateDMPrivacy);
router.put("/update/block/details/privacy/:id", updateBlockDetailsPrivacy);
router.put(
  "/update/block/members/list/privacy/:id",
  updateBlockMembersListPrivacy
);
router.put("/update/blockcast/name/:id", updateBlockcastName);
router.put("/update/blockcast/bio/:id", updateBlockcastBio);
router.get("/block/recomendation", blockRecomendation);

// *** Fetch all recomended group
router.get("/", fetchAllRecomendedGroup);

// *** Fetch all recomended group
router.get("/my-group", fetchMyBlocks);

// *** Fetch all current user member group
router.get("/join-group", fetchJoinBlock);

// *** Fetch single Block
router.get("/:id", fetchSingleBlock);

// Fetch analytics group data
router.get("/fetch/analytics/:id", fetchBlockAnalytics);

// upload cover image
router.post("/cover-image/:id", multer.single("cover_img"), uploadCoverImage);

// ADD to group
router.post("/join/group", joinBlock);

router.put("/add-admin", joinAsAdmin);

router.put("/add-hide", addToHide);

router.put("/remove", removeFromGroupMember);

router.post(
  "/profile-image/:id",
  multer.single("profile_img"),
  blockProfilePicture
);

router.put("/admin/members/:id", addGroupAdmin);

router.put("/unfollow/:id", unFollowGroup);

router.put("/follow/:id", followGroup);

router.get("/members/:id", fetchMembers);

router.put("/pinned/:id", pinnedGroup);

router.get("/search/group", searchBlock);

router.put("/block/name/update/:id", blockNameUpdate);

router.put("/block/bio/update/:id", updateBlockBio);

router.get("/category/lists", blockCatagoryList);

router.put("/update/name/:id", updateBlockName);

router.get("/fetch/block/members/:id", fetchBlockMembers);

router.get("/fetch/block/admins/:id", fetchAdmins);

router.put("/admin/remove/:id", removeFromAdmin);

router.get("/fetch/hide/:id", fetchHideUsers);

router.put("/visitor/:id", addToVisitors);

router.put("/update/bio/:id", updateBlockBioDetails);

/**
 * @END
 */

module.exports = router;
