import dotenv from "dotenv";
dotenv.config();

const [{ default: app }, { default: connectDB }] = await Promise.all([
  import("./src/app.js"),
  import("./src/config/db.js"),
]);


connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
