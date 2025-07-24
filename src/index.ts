import express from "express";
import * as routes from "./controllers";

const app = express();
app.use(express.json());
const port = 8000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/chat", routes.chatRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
