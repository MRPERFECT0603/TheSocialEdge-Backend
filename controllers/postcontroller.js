const moment = require("moment/moment");
const db = require("../connect");
const jwt = require("jsonwebtoken");


const getPosts = (req, res) => {

    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = userId !== "undefined"
            ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
            : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserid) WHERE r.followerUserId = ? OR p.userId = ?
        ORDER BY p.createdAt DESC`;

        const values =
            userId !== "undefined" ? [userId] : [UserInfo.id, UserInfo.id];

        db.query(q, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })




};
const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "INSERT INTO posts(`desc` , `img` , `userId`, `createdAt` ) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            UserInfo.id,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been Created!!!");
        })
    })


};

const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";


        db.query(q, [req.params.id, UserInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0) return res.status(200).json("Post has been Deleted !!!");
            return res.status(403).json("You can delete only your Post");
        })
    })
};
module.exports = { getPosts, addPost, deletePost };