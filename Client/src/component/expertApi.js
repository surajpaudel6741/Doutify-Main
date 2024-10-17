const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Ensure the server can parse JSON request bodies

let doubts = [
  {
    id: 1,
    title: "How to optimize my React code?",
    description: "I am looking for ways to make my React code more efficient.",
    minMoney: 40,
    maxMoney: 60,
    userName: "John Doe",
    userIcon: "https://i.imgur.com/PZTxhX8.png",  
    time: "2 hours ago",
    images: [
      "https://i.imgur.com/yFBBSpB.png",  
      "https://i.imgur.com/2assuA9.png"   
    ],
    bids: [] // Store bids for this doubt
  },
  {
    id: 2,
    title: "Understanding async/await in JavaScript",
    description: "Can someone explain how async/await works?",
    minMoney: 20,
    maxMoney: 40,
    userName: "Jane Smith",
    userIcon: "https://i.imgur.com/PZTxhX8.png",  
    time: "5 hours ago",
    images: [
      "https://i.imgur.com/2assuA9.png"  
    ],
    bids: [] // Store bids for this doubt
  }
];

// Endpoint to get all doubts
app.get('/api/getDoubts', (req, res) => {
  res.json(doubts); // Respond with the doubts array as JSON
});

// Endpoint to submit a bid
app.post('/api/submitBid', (req, res) => {
  const { doubtId, bidAmount } = req.body;

  // Find the doubt by id
  const doubt = doubts.find(d => d.id === doubtId);
  if (!doubt) {
    // If the doubt doesn't exist, return a 404 error as JSON
    return res.status(404).json({ error: "Doubt not found" });
  }

  // Add the bid to the doubt's bids array
  doubt.bids.push({ bidAmount });

  // Return the updated doubt
  return res.json({ message: "Bid submitted successfully", doubt });
});

// Handle 404 errors (for any undefined route)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
