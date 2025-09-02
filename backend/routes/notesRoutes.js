import express from 'express';
import { addNote, deleteNote, getNotes, updateNote } from '../controllers/noteControler.js';

const router = express.Router();

router.get("/", getNotes);  //working
router.put("/:id", updateNote);
router.post("/add", addNote);   //working
router.delete("/:id", deleteNote);


export default router;