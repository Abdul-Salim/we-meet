const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    io.on("connection", (socket) => {
      socket.on("join-room", ({ roomId, userId }) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined", { userId });
      });

      socket.on("leave-room", ({ roomId, userId }) => {
        socket.leave(roomId);
        socket.broadcast.to(roomId).emit("user-left", { userId });
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
