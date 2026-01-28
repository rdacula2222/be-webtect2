// src/students/students.controller.ts
import type { Context } from "hono";
import { pool } from "../config/db.js";
import type { Student } from "./students.model.ts";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Validation helper
function validateStudentInput(data: any, isUpdate = false) {
  const errors: string[] = [];
  const { first_name, last_name, email, age, course, gpa } = data;

  // Required fields for creation
  if (!isUpdate) {
    if (!first_name) errors.push("First name is required");
    if (!last_name) errors.push("Last name is required");
    if (!email) errors.push("Email is required");
    if (!course) errors.push("Course is required");
  }

  // Email format
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email is invalid");

  // Age validation
  if (age !== undefined && (!Number.isInteger(age) || age < 16 || age > 100)) {
    errors.push("Age must be an integer between 16 and 100");
  }

  // GPA validation
  if (gpa !== undefined && (typeof gpa !== "number" || gpa < 0 || gpa > 4.0)) {
    errors.push("GPA must be a number between 0.0 and 4.0");
  }

  return errors;
}

// GET ALL STUDENTS
export const getStudents = async (c: Context) => {
  try {
    const [rows] = await pool.query<Student[] & RowDataPacket[]>(
      "SELECT * FROM students"
    );
    return c.json(rows);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error getting students" }, 500);
  }
};

// GET STUDENT BY ID
export const getStudentById = async (c: Context) => {
  const id = c.req.param("id");
  try {
    const [rows] = await pool.query<Student[] & RowDataPacket[]>(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return c.json({ message: "Student not found" }, 404);

    return c.json(rows[0]);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error fetching student" }, 500);
  }
};

// CREATE STUDENT
export const createStudent = async (c: Context) => {
  try {
    const data = await c.req.json();

    // Validate input
    const errors = validateStudentInput(data);
    if (errors.length > 0) return c.json({ message: "Validation failed", errors }, 400);

    // Check email uniqueness
    const [existing] = await pool.query<Student[]>(
      "SELECT id FROM students WHERE email = ?",
      [data.email]
    );
    if (existing.length > 0) return c.json({ message: "Email already exists" }, 400);

    const {
      first_name,
      last_name,
      email,
      age,
      course,
      year_level,
      gpa,
      enrollment_status,
    } = data;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO students
       (first_name, last_name, email, age, course, year_level, gpa, enrollment_status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name,
        last_name,
        email,
        age || null,
        course,
        year_level || null,
        gpa || null,
        enrollment_status || "Active",
        new Date(),
      ]
    );

    const [newStudentRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM students WHERE id = ?",
      [result.insertId]
    );

    return c.json(newStudentRows[0]);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error creating student" }, 500);
  }
};

// UPDATE STUDENT
export const updateStudent = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const data = await c.req.json();

    // Validate input (partial)
    const errors = validateStudentInput(data, true);
    if (errors.length > 0) return c.json({ message: "Validation failed", errors }, 400);

    // Check email uniqueness if email is updated
    if (data.email) {
      const [existing] = await pool.query<Student[]>(
        "SELECT id FROM students WHERE email = ? AND id != ?",
        [data.email, id]
      );
      if (existing.length > 0) return c.json({ message: "Email already exists" }, 400);
    }

    const {
      first_name,
      last_name,
      email,
      age,
      course,
      year_level,
      gpa,
      enrollment_status,
    } = data;

    await pool.query<ResultSetHeader>(
      `UPDATE students
       SET first_name = ?, last_name = ?, email = ?, age = ?, course = ?, year_level = ?, gpa = ?, enrollment_status = ?
       WHERE id = ?`,
      [
        first_name,
        last_name,
        email,
        age,
        course,
        year_level || null,
        gpa || null,
        enrollment_status || "Active",
        id,
      ]
    );

    const [updatedStudentRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    return c.json(updatedStudentRows[0]);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error updating student" }, 500);
  }
};

// DELETE STUDENT
export const deleteStudent = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return c.json({ message: "Student not found" }, 404);
    }

    return c.json({
      message: `Deleted ${result.affectedRows} student(s)`
    });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error deleting student" }, 500);
  }
};
