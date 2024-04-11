import express from "express";

import cors from "cors";

const port = 3000;
const app = express();

app.use(cors());

let subscribers = 0;

app.get("/subscribers", (_, res) => {
  console.log("get subscribers", subscribers);
  setTimeout(() => {
    res.send("subscribers is " + subscribers);
  }, 1000);
});

app.post("/subscribers", (_, res) => {
  subscribers++;
  console.log("post subscribers", subscribers);

  setTimeout(() => {
    res.send("ok");
  }, 100);
});

let watchers = 0;

app.get("/watchers", (_, res) => {
  console.log("get watchers", watchers);
  setTimeout(() => {
    res.send("watchers is " + watchers);
  }, 1000);
});

app.post("/watchers", (_, res) => {
  watchers++;
  console.log("post watchers", watchers);

  setTimeout(() => {
    res.send("ok");
  }, 100);
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
