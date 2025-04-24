const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const userRouter = require("./routes/useRoutes");
const socketIo = require("./socket");
const groutRoutes = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");

process.env.MONGO_URL;

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
    method: ["GET", "POST"],
    credential: true,
  },
});
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log("db connected"))
  //   .catch((err) => console.log("db error"));
  .catch((err) => console.log("db error", err));

// initialize  socket
socketIo(io);
//our route
app.use("/api/users", userRouter);
app.use("/api/groups" , groutRoutes)
app.use("/api/message" , messageRouter)
// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server is listen oke", PORT));
