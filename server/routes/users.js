const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get all users (admin only - for now, any authenticated user)
router.get('/', authenticateToken, (req, res) => {
  try {
    const users = dbHelpers.getAllUsers();
    res.json({ success: true, users, count: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const user = dbHelpers.getUserById(req.params.id);
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user (admin or self)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Check if user is updating themselves or is admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (email) {
      const existingUser = dbHelpers.getUserByEmail(email);
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ success: false, error: 'Email already in use' });
      }
      updates.email = email;
    }
    if (role && req.user.role === 'admin') {
      updates.role = role;
    }

    const updatedUser = dbHelpers.updateUser(id, updates);
    if (updatedUser) {
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;

    // Only allow deleting other users if admin
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    // Prevent deleting yourself
    if (id === req.user.id) {
      return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
    }

    const deleted = dbHelpers.deleteUser(id);
    if (deleted) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

