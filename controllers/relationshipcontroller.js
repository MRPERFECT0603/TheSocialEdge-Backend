
const db = require("../connect");
const jwt = require("jsonwebtoken");




const getRelationships = (req, res) => {

    const q = "SELECT followerUserId FROM relationships WHERE followedUserid = ?";

    db.query(q, [req.query.followedUserid], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    })
};



const addRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "INSERT INTO relationships (`followerUserId` , `followedUserid`) VALUES (?)";

        const values = [
            UserInfo.id,
            req.body.userId
        ];

        db.query(q, [values] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Following!!!");
        })
    })

};


const deleteRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "DELETE FROM relationships WHERE `followerUserId` = (?) AND `followedUserid` = (?)";


        db.query(q, [UserInfo.id , req.query.userId] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Unfollow!!!");
        })
    })

};



module.exports = { getRelationships , addRelationship , deleteRelationship } 