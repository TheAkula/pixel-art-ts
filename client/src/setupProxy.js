const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/get-img"], { target: "http://localhost:5000" })
  );
};
