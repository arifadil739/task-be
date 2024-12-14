import express from 'express';
import * as taskController from '../controllers/taskController';
import { validateTask } from '../validations/task.validation';

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;