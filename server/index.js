// const express = require("express");
// const cors = require("cors");
// const http = require('http');
// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");
// const messageRoutes = require("./routes/messages");
// const app = express();
// const socket = require("socket.io");
// require("dotenv").config();

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connetion Successfull");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// const server = app.listen(process.env.PORT, () =>
//   console.log(`Server started on ${process.env.PORT}`)
// );
// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   console.log('Client connected1:', socket.id);
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });
//   console.log('Client connected2:', socket.id);

//   socket.on('offer', (offer) => {
//     console.log('Offer received:', offer);
//     // Broadcast offer to all other clients except the sender
//     socket.broadcast.emit('offer', offer);
//   });


//   socket.on('hang-up', () => {
//     console.log('Client disconnected hangup:', socket.id);
//     // Broadcast hang-up event to all other clients except the sender
//     socket.broadcast.emit('hang-up');
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected2:', socket.id);
//   });


//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });





const express = require("express");
const cors = require("cors");
const http = require('http');
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const socketIo = require("socket.io"); // Import socket.io
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("DB Connection Successful");
})
.catch((err) => {
  console.error("DB Connection Error:", err.message);
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from frontend
    credentials: true,
  },
});

// Map to store online users
const onlineUsers = new Map();

// Socket.IO event handlers
io.on("connection", (socket) => {
  console.log('Client connected:', socket.id);

  // Add user to online users map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log('User added:', userId);
  });

  // Handle offer from client
// Inside your socket connection handling
socket.on('offer', (offer) => {
  console.log('Offer received:', offer);
  // Broadcast offer to all other clients except the sender
  socket.broadcast.emit('offer', offer);
});


  // Handle hang-up event from client
  socket.on('hang-up', () => {
    console.log('Client disconnected (hang-up):', socket.id);
    // Broadcast hang-up event to all other clients except the sender
    socket.broadcast.emit('hang-up');
    // Remove user from online users map
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  
    socket.on('answer', (answer) => {
      console.log('Answer received:Server', answer);
      // Broadcast the answer to the appropriate client
      // You need to identify the recipient client based on your application logic
      // For example, if you have stored user IDs associated with socket IDs, you can use that information here
      io.to(/* recipientSocketId */).emit('answer', answer);
    });
  
    // Other event listeners and server logic
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove user from online users map
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    });
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
