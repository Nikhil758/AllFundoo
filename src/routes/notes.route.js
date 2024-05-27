import express from 'express';
import * as notesController from '../controllers/notes.controller';
import { newNotesValidator } from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('', userAuth, notesController.getAllNotes);

router.post('', userAuth, newNotesValidator, notesController.newNoteCreate);

router.get('/:_id', userAuth, notesController.getNoteById);

router.put('/:_id', userAuth, notesController.updateNote);

router.delete('/:_id', userAuth, notesController.deleteNote);

router.put('/:_id/archive', userAuth, notesController.archive);

router.put('/:_id/trash', userAuth, notesController.trash);

export default router;
