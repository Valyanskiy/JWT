const express = require('express');
const path = require("node:path");

const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/main.html');
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});