require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const http = require('http');
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

app.use(cors());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/images', async (req, res) => {
  const prompt = req.body.prompt;
  const n = req.body.n;
  const size = req.body.size;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: n,
      size: size,
    });

    // Extract the relevant data from the response object
    const { data } = response.data;

    // Send the data back to the client
    res.json(data);
  } catch (error) {
    // Handle the promise rejection error
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});


app.get('/test', (req, res) => {
   res.send('Test successful');
})



server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
