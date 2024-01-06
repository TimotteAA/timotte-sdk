const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

app.post("*", (req, res) => {
  res.status(200).send({ id: "123456" });
});

app.listen(4000, () => {
  console.log("server start");
});
