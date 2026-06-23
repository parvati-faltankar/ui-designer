const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Page name is required'],
      trim: true,
      maxlength: [100, 'Page name cannot exceed 100 characters'],
    },
    route: {
      type: String,
      required: [true, 'Page route is required'],
      trim: true,
    },
    layoutTree: {
      type: Array, // JSON tree of nodes
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure that route is unique per project
pageSchema.index({ projectId: 1, route: 1 }, { unique: true });

module.exports = mongoose.model('Page', pageSchema);
