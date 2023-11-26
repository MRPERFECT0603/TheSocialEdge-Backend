const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const PORT = 8000;

const app = express();
app.use('/profile/uploads', express.static('../client/public/uploads'));

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  next()
});
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads')
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage });


app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.get("/logout" , (req,res)=>{
  res.clearCookie("accessToken", {
    secure: true,
    samesite: "none"
}).status(200).json("User has been loged out!!!");
});

app.use("/api/users", require("./Routes/users"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/comments", require("./Routes/comments"));
app.use("/api/posts", require("./Routes/posts"));
app.use("/api/likes", require("./Routes/likes"));
app.use("/api/relationships", require("./Routes/relationships"));


app.listen(PORT, (req, res) => {
  console.log(`The server has been started on ${PORT}`);
});