import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Note from '../models/Note.js';

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      date, 
      startDate, 
      endDate, 
      tag, 
      color,
      isPinned,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50,
      search
    } = req.query;

    // Build filter object
    const filter = { user: req.user.id };
    
    if (date) {
      const notes = await Note.getNotesForDate(req.user.id, new Date(date));
      return res.json({ notes });
    }
    
    if (startDate && endDate) {
      const notes = await Note.getNotesForDateRange(
        req.user.id, 
        new Date(startDate), 
        new Date(endDate)
      );
      return res.json({ notes });
    }
    
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    
    if (color && color !== 'all') {
      filter.color = color;
    }
    
    if (isPinned !== undefined) {
      filter.isPinned = isPinned === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Add secondary sort for pinned notes
    if (sortBy !== 'isPinned') {
      sortObj.isPinned = -1;
    }
    
    // Add tertiary sort for consistency
    if (sortBy !== 'createdAt') {
      sortObj.createdAt = -1;
    }

    const notes = await Note.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('linkedTasks', 'title status priority')
      .populate('user', 'name email');

    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get a specific note
router.get('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('linkedTasks', 'title status priority')
      .populate('user', 'name email');

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json(note);

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Create a new note
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, date, tags, color, isPinned, linkedTasks } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        message: 'Note title is required'
      });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: 'Note content is required'
      });
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      date: date ? new Date(date) : new Date(),
      tags: tags || [],
      color: color || 'default',
      isPinned: isPinned || false,
      linkedTasks: linkedTasks || [],
      user: req.user.id
    });

    await note.save();
    await note.populate('linkedTasks', 'title status priority');
    await note.populate('user', 'name email');

    res.status(201).json({
      message: 'Note created successfully',
      note
    });

  } catch (error) {
    console.error('Create note error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Update a note
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, date, tags, color, isPinned, linkedTasks } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (date !== undefined) updateData.date = date ? new Date(date) : new Date();
    if (tags !== undefined) updateData.tags = tags;
    if (color !== undefined) updateData.color = color;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (linkedTasks !== undefined) updateData.linkedTasks = linkedTasks;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('linkedTasks', 'title status priority')
      .populate('user', 'name email');

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json({
      message: 'Note updated successfully',
      note
    });

  } catch (error) {
    console.error('Update note error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Toggle pin status
router.patch('/:id/pin', authenticate, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    await note.populate('linkedTasks', 'title status priority');
    await note.populate('user', 'name email');

    res.json({
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note
    });

  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Delete a note
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }

    res.json({
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Bulk delete notes
router.delete('/bulk/delete', authenticate, async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).json({
        message: 'Note IDs must be a non-empty array'
      });
    }

    const result = await Note.deleteMany({
      _id: { $in: noteIds },
      user: req.user.id
    });

    res.json({
      message: `${result.deletedCount} notes deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Bulk delete notes error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default router;