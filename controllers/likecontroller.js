
const db = require("../connect");
const jwt = require("jsonwebtoken");




const getLikes = (req, res) => {

    const q = "SELECT userId FROM likes WHERE postId = ?";

    db.query(q, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userId));
    })
};



const addLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "INSERT INTO likes (`userID` , `postId`) VALUES (?)";

        const values = [
            UserInfo.id,
            req.body.postId
        ];

        db.query(q, [values] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been liked!!!");
        })
    })

};


const deleteLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token)
        return res.token(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");

        const q = "DELETE FROM likes WHERE `userId` = (?) AND `postId` = (?)";


        db.query(q, [UserInfo.id , req.query.postId] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Like has been Deleted!!!");
        })
    })

};



module.exports = { getLikes , addLike , deleteLike }