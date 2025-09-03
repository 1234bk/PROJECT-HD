import express from 'express';
import { addNote, deleteNote, getNotes, updateNote } from '../controllers/noteControler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", protect, getNotes);  //working
router.put("/:id", protect, updateNote);
router.post("/add", protect, addNote);   //working
router.delete("/:id", protect, deleteNote);


export default router;