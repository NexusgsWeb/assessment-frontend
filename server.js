const express = require("express");
const path = require("path");

//getting our posts routes
const posts = require("./server/routes/posts");

const app = express();
// using middleware
app.use(express.static(path.join(__dirname, "dist")));
app.use("/posts", posts);

// Catch all other routes request and return  it to the index
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/madrasatie-frontend/index.html"));
});

const port = process.env.PORT || 4600;
app.listen(port, (req, res) => {
  console.log("running on port " + port);
});
