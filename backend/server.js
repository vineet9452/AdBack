const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { verifyToken, verifyAdmin } = require("./authMiddleware");
const User = require("./userSchema");
const Employee = require("./employeeSchema");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err); // 👉 इससे एरर डिटेल्स टर्मिनल में दिखेंगी
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    //  Generate JWT Token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Login successful",
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } catch (err) {
    res.status(500).send({ message: "Error logging in" });
  }
});

app.get("/employees", verifyToken, async (req, res) => {
  const employees = await Employee.find();
  res.status(200).send(employees);
});

app.post("/employees", verifyToken, async (req, res) => {
  const { firstName, lastName, age } = req.body;
  const newEmployee = new Employee({ firstName, lastName, age });
  const savedEmployee = await newEmployee.save();
  res.status(201).send(savedEmployee);
});

app.put("/employees/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, age } = req.body;
  const updatedEmployee = await Employee.updateOne(
    { _id: id },
    { $set: { firstName, lastName, age } }
  );
  res.status(200).send(updatedEmployee);
});

app.delete("/employees/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  const deletedEmployee = await Employee.deleteOne({ _id: id });
  res.status(200).send(deletedEmployee);
});

app.get("/admin/employees", verifyToken, verifyAdmin, async (req, res) => {
  const employees = await Employee.find();
  res.status(200).send(employees);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
