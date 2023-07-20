// app.js (Backend)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Create an object to store the word counts
const wordCounts = {
    hello: 1,
    world: 2,
    example: 3,
};

// Endpoint to receive word selections from the frontend
app.get("/selectedWord", (req, res) => {
    const selectedWord = req.query.word;
    console.log("selectedWord", selectedWord);

    // Increment the word count if it already exists in the state
    wordCounts[selectedWord] = (wordCounts[selectedWord] || 0) + 1;

    res.status(200).json({ message: "Word count updated successfully." });
});

// Endpoint to send word counts to the frontend
app.get("/wordCounts", (req, res) => {
    res.status(200).json(wordCounts);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
