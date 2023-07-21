const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Create an object to store the word counts
const wordCounts = {
    hello: 1,
    world: 2,
    example: 3,
};

// To keep track of the last time a word was processed
const lastWordProcessed = {};

// Endpoint to receive word selections from the frontend
app.get("/selectedWord", (req, res) => {
    const selectedWord = req.query.word;
    console.log("selectedWord", selectedWord);

    // Get the current timestamp in milliseconds
    const currentTime = Date.now();

    // If the word was processed within the last second, ignore it
    if (lastWordProcessed[selectedWord] && currentTime - lastWordProcessed[selectedWord] < 1000) {
        console.log("Word already processed within the last second. Ignoring.");
        res.status(200).json({ message: "Word already processed within the last second. Ignoring." });
        return;
    }

    // Increment the word count if it already exists in the state
    wordCounts[selectedWord] = (wordCounts[selectedWord] || 0) + 1;

    // Update the lastWordProcessed with the current timestamp
    lastWordProcessed[selectedWord] = currentTime;

    res.status(200).json({ message: "Word count updated successfully." });
});

// Endpoint to send word counts to the frontend
app.get("/wordCounts", (req, res) => {
    res.status(200).json(wordCounts);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
