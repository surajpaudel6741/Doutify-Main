const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const { wss } = require('./ws/websocketServer');
const http = require('http');
const connectDb = require('./config/dbConnection');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

// Connect to the database
connectDb().catch(error => console.log("Database connection error: ", error));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/formuploads')));


// Enable CORS for the frontend
app.use(cors({
  origin: 'http://localhost:3000', // Allow React frontend to communicate with backend
  credentials: true, // Allow cookies
}));



// Session management
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));

// API Routes
app.use("/request", require('./router/requestRoutes'));
app.use("/user", require('./router/formRoutes'));
app.use("/call", require('./router/videoCallRoutes'));
app.use("/", require('./router/userRoutes'));

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../client/build')));



// Catch-all route to serve the React frontend for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// WebSocket Upgrade Handling
server.on('upgrade', (request, socket, head) => {
  console.log('Upgrade request received');
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is online at http://localhost:${PORT}`);
});
