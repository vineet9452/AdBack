const mongoose = require("./dbConnection");

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
