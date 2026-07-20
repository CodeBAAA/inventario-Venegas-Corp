const serverless = require("serverless-http");
const app = require("./app");

// API Gateway must receive PDFs as base64. Without this option serverless-http
// decodes the PDF buffer as UTF-8, corrupting the downloaded document.
module.exports.handler = serverless(app, {
  binary: ['application/pdf']
});
