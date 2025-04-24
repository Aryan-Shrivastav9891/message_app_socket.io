const socketIo = (io) => {
  //* store connection users with there room information using socket.id as there key

  const connectedUsers = new Map();
  //* handel new socket connection
  io.on("connection", (socket) => {
    //Get User get authentication
    const user = socket.handshake.auth.user;
    console.log("user connected", user?.username);
    //! Start: Join Room Handler
    socket.on("join room", (groupId) => {
      //Add socket to the specific room
      socket.join(groupId);
      // Store user and room info in connectedUser map
      connectedUsers.set
    });
    //! end : Join Room Handler

    //! Start: Leave Room Handler
    //! end : Leave Room Handler

    //! Start: New Message Room Handler
    //! end : New Message Room Handler

    //! Start: Disconnected Room Handler
    //! end : Disconnected Room Handler

    //! Start: Typing indicated
    //! end : Typing indicated
  });
};

module.exports = socketIo;
