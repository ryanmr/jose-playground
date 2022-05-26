import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.json({
    project: "swc-express-template",
    time: Date.now(),
  });
});

app.get("*", (_, res) => {
  res.status(404).json({
    status: 404,
    message: "not found",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is ready at: http://localhost:${port}`);
});
