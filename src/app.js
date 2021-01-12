const http = require('http');
const url = require('url');
const generate = require('./generator');

const server = http.createServer((request, response) => {
  const query = url.parse(request.url, true).query || {};

  const barcode = generate({...query});
  const buffer = Buffer.from(barcode, 'base64');

  response.setHeader("Content-Type", "image/jpeg");
  response.writeHead(200);
  response.end(buffer);
});

module.exports = server;