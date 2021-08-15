import app from "./src/app";

const port: number = parseInt(process.env.PORT ?? "5000");

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
