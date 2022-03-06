const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/get-img/:id"], { target: "http://localhost:3001" })
  );
};
