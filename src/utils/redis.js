import { createClient } from 'ioredis';

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

// Function to fetch single note
export const getSingleNote = async (userId, noteId) => {
  const note = await client.get(`note:${userId}:${noteId}`);
  return note;
};

// Function to set single note
export const setSingleNote = async (userId, noteId, data) => {
  await client.set(`note:${userId}:${noteId}`, data);
};

// Function to set all notes
export const setAllNotes = async (userId, notes) => {
  for (const note of notes) {
    await client.set(`note:${userId}:${note._id}`, note);
  }
};

// Function to delete single note
export const deleteSingleNote = async (userId, noteId) => {
  await client.del(`note:${userId}:${noteId}`);
};

// Function to fetch all notes for a user
export const getAllNotesForUser = async (userId) => {
  try {
    const noteKeys = await client.keys(`note:${userId}:*`);
    if (!noteKeys.length) {
      return null;
    }
    const notesData = await client.mget(noteKeys);
    const notes = notesData.map((data) => data);
    return notes;
  } catch (error) {
    throw error;
  }
};

export default client;
