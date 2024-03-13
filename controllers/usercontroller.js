
const db = require("../connect");
const jwt = require("jsonwebtoken");

const getUser = (req, res) => {
    const userId = req.params.userId;

    const q = "SELECT * FROM users WHERE id = ?"

    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err);
        const { password, ...info } = data[0];
        return res.json(info);
    })
}

const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.status(401).json("Not Logged In!!!");

    jwt.verify(token, "secretKey", (err, UserInfo) => {
        if (err) return res.status(403).json("Token is not valid!!!");
        const q = "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=? WHERE id=? "


        db.query(
            q,
            [
                req.body.name,
                req.body.city,
                req.body.website,
                req.body.profilePic,
                req.body.coverPic,
                UserInfo.id,
            ],
            (err, data) => {
                if (err) res.status(500).json(err);
                if (data.affectedRows > 0) return res.json("Updated!");
                return res.status(403).json("You can update only your post!");
            }
        );

    })
}
module.exports = { getUser, updateUser };