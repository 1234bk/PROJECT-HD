import Note from "../models/Notes.js";

// Add Note
export const addNote = async (req, res) => {
  try {
    const {  content } = req.body;
    if ( !content) {
      return res.status(400).json({ message: "content required" });
    }

    const note = new Note({
      user: req.user._id, // assuming user is added in req from middleware
      
      content,
    });

    await note.save();
    res.status(201).json({ message: "Note added successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Notes for User
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { content },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
