/** @format */

require("dotenv").config();
const router = require("express").Router();
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../../../aerospike");
const {
  fetchAllNotification,
  markNotificationAsView,
  fetchNotificationCount,
} = require("../../../controller/notificationController");

router.get("/", fetchAllNotification);
router.put("/update/view/:id", markNotificationAsView);

router.get("/fetch/notification/count", fetchNotificationCount);

module.exports = router;
