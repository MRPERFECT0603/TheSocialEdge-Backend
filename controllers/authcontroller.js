const db = require("../connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = (req, res) => {
    //check if user is there 
    const q = "SELECT * FROM users WHERE username = ?";


    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length) return res.status(409).json("User already exists!!!");
        //hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        //create a new user
        const q = "INSERT INTO users (`username` , `email` , `password` , `name`) VALUE (?)"
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(400).json("User has been created!!!!");
        });
    });




}


const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(400).json("User doesn't Exist!!!!");


        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);


        if (!checkPassword)
            return res.status(400).json("Wrong Username or Password!!!");


        const token = jwt.sign({ id: data[0].id }, "secretKey");


        const { password, ...others } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(others);
    });

}



const logout = (req, res) => {
    console.log("Attempting to log out...");
    res.clearCookie("accessToken", {
        secure: true,
        samesite: "none"
    }).status(200).json("User has been loged out!!!");
}



module.exports = { login, register, logout }