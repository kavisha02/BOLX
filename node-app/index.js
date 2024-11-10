const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
var jwt = require("jsonwebtoken");
const multer = require("multer");
const http = require("http");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const bodyParser = require("body-parser");
const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 4000;
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://naimu:naimu123@cluster0.t6uhb.mongodb.net/?retryWrites=true&w=majority"
);
//mongoose.connect('mongodb+srv://h20240086:<db_password>@cluster0.omno8.mongodb.net/')

app.get("/", (req, res) => {
  res.send("hello...");
});

app.get("/search", productController.search);
app.post("/like-product", userController.likeProducts);
app.post("/dislike-product", userController.dislikeProducts);
app.post(
  "/add-product",
  upload.fields([{ name: "pimage" }, { name: "pimage2" }]),
  productController.addProduct
);
app.get("/get-products", productController.getProducts);
app.post("/delete-product", productController.deleteProduct);
app.get("/get-product/:pId", productController.getProductsById);
app.post("/liked-products", userController.likedProducts);
app.post(
  "/edit-product",
  upload.fields([{ name: "pimage" }, { name: "pimage2" }]),
  productController.editProduct
);
app.post("/my-products", productController.myProducts);
app.post("/signup", userController.signup);
app.get("/my-profile/:userId", userController.myProfileById);
app.get("/get-user/:uId", userController.getUserById);
app.post("/login", userController.login);

let messages = [];

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on("sendMsg", (data) => {
    messages.push(data);
    io.emit("getMsg", messages);
  });

  io.emit("getMsg", messages);
});
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
