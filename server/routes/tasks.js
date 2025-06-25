import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      tag, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50,
      search
    } = req.query;

    // Build filter object
    const filter = { user: req.user.id };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Add secondary sort for consistent ordering
    if (sortBy !== 'createdAt') {
      sortObj.createdAt = -1;
    }

    const tasks = await Task.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get task statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await Task.getUserStats(req.user.id);
    
    // Get overdue tasks count
    const overdueCount = await Task.countDocuments({
      user: req.user.id,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueTodayCount = await Task.countDocuments({
      user: req.user.id,
      status: { $ne: 'completed' },
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.json({
      ...stats,
      overdue: overdueCount,
      dueToday: dueTodayCount
    });

  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Get a specific task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json(task);

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Create a new task
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, priority, tags, dueDate, subtasks } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        message: 'Task title is required'
      });
    }

    // Get the highest order number for the user
    const highestOrderTask = await Task.findOne({ user: req.user.id })
      .sort({ order: -1 })
      .select('order');
    
    const nextOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    const task = new Task({
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'medium',
      tags: tags || [],
      dueDate: dueDate ? new Date(dueDate) : undefined,
      subtasks: subtasks || [],
      user: req.user.id,
      order: nextOrder
    });

    await task.save();
    await task.populate('user', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    
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

// Update a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, description, status, priority, tags, dueDate, subtasks } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (tags !== undefined) updateData.tags = tags;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (subtasks !== undefined) updateData.subtasks = subtasks;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    
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

// Update task order (for drag and drop)
router.put('/:id/order', authenticate, async (req, res) => {
  try {
    const { newOrder } = req.body;

    if (typeof newOrder !== 'number') {
      return res.status(400).json({
        message: 'New order must be a number'
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { order: newOrder },
      { new: true }
    ).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json({
      message: 'Task order updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task order error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Bulk update task orders
router.put('/bulk/reorder', authenticate, async (req, res) => {
  try {
    const { taskOrders } = req.body;

    if (!Array.isArray(taskOrders)) {
      return res.status(400).json({
        message: 'Task orders must be an array'
      });
    }

    const bulkOps = taskOrders.map((item, index) => ({
      updateOne: {
        filter: { _id: item.id, user: req.user.id },
        update: { order: index }
      }
    }));

    await Task.bulkWrite(bulkOps);

    res.json({
      message: 'Task orders updated successfully'
    });

  } catch (error) {
    console.error('Bulk reorder error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    res.json({
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Bulk delete tasks
router.delete('/bulk/delete', authenticate, async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        message: 'Task IDs must be a non-empty array'
      });
    }

    const result = await Task.deleteMany({
      _id: { $in: taskIds },
      user: req.user.id
    });

    res.json({
      message: `${result.deletedCount} tasks deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default router;