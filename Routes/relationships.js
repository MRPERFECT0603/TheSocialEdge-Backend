const express = require("express");
const { getRelationships , deleteRelationship , addRelationship } = require("../controllers/relationshipcontroller");

const router = express.Router();

router.get("/" , getRelationships);
router.post("/" , addRelationship);
router.delete("/" , deleteRelationship);



module.exports = router;