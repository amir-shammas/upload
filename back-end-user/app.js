const express = require("express");
const { setHeaders } = require("./middlewares/headers.middleware");
const { errorHandler } = require("./middlewares/errors.middleware");
const fileUpload = require("express-fileupload");


//* routes import
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");


const app = express();


//* BodyPaser
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(express.json({ limit: "5mb" }));


//* CORS Policy Definitions
app.use(setHeaders);


//* Upload
app.use(fileUpload());
app.use(express.static("public"));


//* Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


//* Error Controller
app.use((req, res) => {
  console.log("This path is not available:", req.path);
  res.status(404).json({ message: "404 OOPS! PATH NOT FOUND" });
});
app.use(errorHandler);


module.exports = app;
