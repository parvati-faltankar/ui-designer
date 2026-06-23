const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// ─── GET /api/projects ───────────────────────────────────────────────────────
// Returns all projects sorted by newest first
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects', error: err.message });
  }
});

// ─── POST /api/projects ──────────────────────────────────────────────────────
// Creates a new project
router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const project = new Project({ name: name.trim(), description, color });
    const saved = await project.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/projects/:id ────────────────────────────────────────────────
// Deletes a project by ID
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/projects/:id ───────────────────────────────────────────────────
// Get a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/projects/:id ───────────────────────────────────────────────────
// Update project details (including theme)
router.put('/:id', async (req, res) => {
  try {
    const { name, description, color, status, themeTemplate } = req.body;
    
    // Create an update object, only updating provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (color !== undefined) updateData.color = color;
    if (status !== undefined) updateData.status = status;
    if (themeTemplate !== undefined) updateData.themeTemplate = themeTemplate;

    if (updateData.name === '') {
      return res.status(400).json({ success: false, message: 'Project name cannot be empty' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
