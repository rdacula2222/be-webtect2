import { Hono } from 'hono';
import { createStudent, getStudents, updateStudent, deleteStudent } from './students.controller.js';

const studentsRoute = new Hono();

studentsRoute.get('/', getStudents);
studentsRoute.post('/', createStudent);
studentsRoute.put('/:id', updateStudent);
studentsRoute.delete('/:id', deleteStudent);

export default studentsRoute;