import { Router } from "express";
import {
  addTodo,
  listTodos,
  removeTodo,
  updateTodo,
} from "../controllers/todoController.js";
import { validateTodoPayload, validateTodoUpdatePayload } from "../middleware/validate.js";

const router = Router();

router.get("/", listTodos);
router.post("/", validateTodoPayload, addTodo);
router.put("/:id", validateTodoUpdatePayload, updateTodo);
router.delete("/:id", removeTodo);

export default router;
