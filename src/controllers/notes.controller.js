import HttpStatus from 'http-status-codes';
import * as NoteService from '../services/notes.service';

/**
 * Controller to create a new note
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const newNoteCreate = async (req, res, next) => {
  try {
    req.body.createdBy = res.locals.user._id;
    const data = await NoteService.newNoteCreate(res.locals.user._id, req.body);
    const { _id, title } = data;
    const user_id = res.locals.user._id;
    const createdBy = res.locals.user._id;
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Note created successfully',
      data: {
        user_id,
        _id,
        title,
        createdBy
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to create a new note
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const getAllNotes = async (req, res) => {
  const data = await NoteService.getAllNotes(res.locals.user._id);
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'Notes found in database',
    data: data
  });
};

/**
 * Controller to create a new note
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const getNoteById = async (req, res) => {
  try {
    const data = await NoteService.getNoteById(
      res.locals.user._id,
      req.params._id
    );
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Note fetched successfully',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to toggle isArchive
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const archive = async (req, res, next) => {
  try {
    const data = await NoteService.archive(res.locals.user._id, req.params._id);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Toggled isArchive successfully',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to toggle isTrash
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const trash = async (req, res, next) => {
  try {
    const data = await NoteService.trash(res.locals.user._id, req.params._id);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Toggled isTrash successfully',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update a note
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const updateNote = async (req, res, next) => {
  try {
    const data = await NoteService.updateNote(
      res.locals.user._id,
      req.params._id,
      req.body
    );
    const { _id, title } = data;
    const createdBy = res.locals.user._id;
    res.status(HttpStatus.ACCEPTED).json({
      success: true,
      message: 'Note updated successfully',
      data: {
        _id,
        title,
        createdBy
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a note
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const deleteNote = async (req, res, next) => {
  try {
    await NoteService.deleteNote(res.locals.user._id, req.params._id);
    const user_id = res.locals.user._id;
    const user_mail = res.locals.user.email;
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Note deleted successfully',
      data: {
        user_id,
        user_mail
      }
    });
  } catch (error) {
    next(error);
  }
};
