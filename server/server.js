import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = Number(process.env.PORT) || 5001;

app.listen(port, () => {
  console.log(`AgentFlow API listening on port ${port}`);
});
