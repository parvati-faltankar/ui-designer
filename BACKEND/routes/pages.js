const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// GET /api/pages/:projectId - Get all pages for a project
router.get('/:projectId', async (req, res) => {
  try {
    const pages = await Page.find({ projectId: req.params.projectId }).sort({ createdAt: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch pages', error: err.message });
  }
});

// POST /api/pages - Create a new page
router.post('/', async (req, res) => {
  try {
    const { projectId, name, route } = req.body;
    
    if (!projectId || !name || !route) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const page = new Page({ projectId, name, route, layoutTree: [] });
    const saved = await page.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/pages/:id - Update page layout tree or settings
router.put('/:id', async (req, res) => {
  try {
    const { name, route, layoutTree } = req.body;
    const page = await Page.findByIdAndUpdate(
      req.params.id,
      { $set: { name, route, layoutTree } },
      { new: true, runValidators: true }
    );
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/pages/:id - Delete a page
router.delete('/:id', async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
