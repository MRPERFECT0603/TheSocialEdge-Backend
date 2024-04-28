const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

cloudinary.config({
  cloud_name: 'dbm2pouet',
  api_key: '967692317111817',
  api_secret: '_wG_h8dp0wsiz_z0rsv5h7-mJYk'
});

const PORT = 8000;

const app = express();
app.use('/profile/uploads', express.static('../client/public/uploads'));

app.use(fileUpload());

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true)
  next()
});
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
app.use(cors({
  origin: "https://TheSocialEdge.netlify.app",
  credentials: true,
}));
app.use(cookieParser());

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../client/public/uploads')
//   },
//   filename: function (req, file, cb) {

//     cb(null, Date.now() + file.originalname)
//   }
// })

// const upload = multer({ storage: storage });


// app.post("/api/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   res.status(200).json(file.filename);
// });



app.post("/api/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const uploadedFile = req.files.file;
    console.log("File received:", uploadedFile);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "uploads" }, // Specify the folder name
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Upload to Cloudinary successful:", result);
        res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(uploadedFile.data);

  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/logout", (req, res) => {
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
