require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");


const apiKey = process.env.API_KEY;


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
  const response = await openai.createImage({
    prompt: prompt,
    n: n,
    size: size,
  });

  
  // Extract the relevant data from the response object
  const { data } = response.data;

  // Send the data back to the client
  res.json(data);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

