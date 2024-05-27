import Note from '../models/note.model';
import {
  deleteSingleNote,
  getAllNotesForUser,
  getSingleNote,
  setAllNotes,
  setSingleNote
} from '../utils/redis';

//Create a note
export const newNoteCreate = async (_id, body) => {
  const data = await Note.create(body);
  setSingleNote(_id, data._id, data);
  return data;
};

//Get all notes
export const getAllNotes = async (_id) => {
  const notes = await getAllNotesForUser(_id);
  if (notes) {
    return notes;
  } else {
    const data = await Note.find({ createdBy: _id }, { title: 1 , description: 1, isArchive: 1, isTrash: 1, color: 1});
    await setAllNotes(_id, data);
    return data;
  }
};

// Get note by id
export const getNoteById = async (user_id, _id) => {
  const note = await getSingleNote(user_id, _id);
  if (note) {
    return note;
  } else {
    const data = await Note.findOne({ _id }, { title: 1 , description: 1, isArchive: 1, isTrash: 1, color: 1});
    await setSingleNote(user_id, _id, data);
    return data;
  }
};

//isArchive
export const archive = async (user_id, _id) => {
  const d = await Note.findById(
    { _id },
    { title: 1, isArchive: 1, createdBy: 1 }
  );
  d.isArchive = !d.isArchive;
  const data = await d.save();
  setSingleNote(user_id, _id, data);
  return data;
};

//isTrash
export const trash = async (user_id, _id) => {
  const d = await Note.findById(
    { _id },
    { title: 1, isTrash: 1, createdBy: 1 }
  );
  d.isTrash = !d.isTrash;
  const data = await d.save();
  setSingleNote(user_id, _id, data);
  return data;
};

//update single note
export const updateNote = async (user_id, _id, body) => {
  deleteSingleNote(user_id, _id);
  const data = await Note.findByIdAndUpdate(
    {
      _id
    },
    body,
    {
      new: true
    }
  );
  setSingleNote(user_id, _id, data);
  return data;
};

//delete single note
export const deleteNote = async (user_id, id) => {
  deleteSingleNote(user_id, id);
  await Note.findByIdAndDelete(id);
  return '';
};
