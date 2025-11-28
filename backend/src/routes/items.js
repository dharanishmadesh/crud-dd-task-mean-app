const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const item = new Item({ name, description });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
