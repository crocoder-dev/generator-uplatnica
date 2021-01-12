const express = require('express');
const generate = require('./generator');

const app = express();
app.use(express.json());

app.use((error, request, response, next) => {
  if (error) return response.send('Unable to parse JSON');
  return next();
});

app.post('/', (request, response) => {
  
  const barcode = generate(request.body);
  const buffer = Buffer.from(barcode, 'base64');

  response.setHeader("Content-Type", "image/jpeg");
  response.send(buffer);
});


module.exports = app;