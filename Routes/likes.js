const express = require("express");
const { getLikes , deleteLike , addLike } = require("../controllers/likecontroller");

const router = express.Router();

router.get("/" , getLikes);
router.post("/" , addLike);
router.delete("/" , deleteLike);



module.exports = router;