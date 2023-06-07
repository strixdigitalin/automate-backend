// ------------------BASE TEMPLATE-----------------------

const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.port || 5000;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
var cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
require("./Middleware/Connection");

app.use(function (req, res, next) {
  console.log(req._parsedUrl.path, "----<<<<<<<<<<<Current ");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// 0------SOCKET SETUP
http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// ---------

// -------------------------------------- REQUIRE ROUTES-----------------------
const AuthRoutes = require("./Routes/AuthRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const SocketConst = require("./Constants/Socketconst");
// const UserRoutes =require("./Routes/")

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
// app.use("/user", UserRoutes);
// app.use("/subscription", SubscriptionRoutes);
// app.use("/coupon", CouponRoutes);
// app.use("/feedback", FeedbackRoutes);

io.on("connection", (socket, res) => {
  console.log(`User connected ${socket.id}`);
  //   io.sockets.emit("checkConnection", "YOU ARE CONNECTED TO SOCKET SERVER");

  socket.on(SocketConst.JOIN_ON_ROOM, (res) => {
    console.log(res, "<<<<thisisafterjoining");
    socket.join(res.id);
  });

  socket.on(SocketConst.INITIATE_REQUEST, (res) => {
    console.log(res, "<<<thisissendreq");
    io.to(res.to).emit(SocketConst.NEW_REQUEST, { ...res });
    // io.to(res.to).emit(SocketConst.JOIN_ON_ROOM, { code: res.code });
  });
  socket.on(SocketConst.REQUEST_RESPONSE, (res) => {
    console.log(res, "<<<thisissendreq");
    io.to(res.to).emit(SocketConst.ANSWER_OF_REQUEST, { ...res });
  });
});

// module.exports = app;
// server.listen(PORT, () => console.log(PORT));

server.listen(PORT, () => console.log(PORT));
