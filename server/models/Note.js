import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [100, 'Note title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    maxlength: [2000, 'Note content cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  color: {
    type: String,
    enum: ['default', 'blue', 'green', 'yellow', 'red', 'purple', 'pink'],
    default: 'default'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  linkedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
noteSchema.index({ user: 1, date: 1 });
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ user: 1, tags: 1 });

// Virtual for formatted date
noteSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for day of year
noteSchema.virtual('dayOfYear').get(function() {
  const start = new Date(this.date.getFullYear(), 0, 0);
  const diff = this.date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
});

// Static method to get notes for a specific date
noteSchema.statics.getNotesForDate = async function(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await this.find({
    user: userId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ isPinned: -1, createdAt: -1 });
};

// Static method to get notes for a date range
noteSchema.statics.getNotesForDateRange = async function(userId, startDate, endDate) {
  return await this.find({
    user: userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1, isPinned: -1, createdAt: -1 });
};

const Note = mongoose.model('Note', noteSchema);

export default Note;