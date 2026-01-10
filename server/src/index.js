const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
