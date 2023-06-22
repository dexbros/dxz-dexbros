/** @format */

const router = require("express").Router();
const { default: mongoose } = require("mongoose");

router.post("/", async (req, res) => {
  const newPostConfig = Post_Config({
    _id: new mongoose.Types.ObjectId(),
    bannedWord: req.body.word,
  });
  await newPostConfig.save();
  try {
    return res.status(200).json({ msg: "Updated" });
  } catch (error) {
    return res.status(501).json({ msg: "Error" });
  }
});

router.get("/", async (req, res) => {
  var config = await Post_Config.find();
  return res.status(200).json(config[0]);
});

module.exports = router;
