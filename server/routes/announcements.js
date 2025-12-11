import express from 'express';
import Announcement from '../models/Announcement.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all announcements (public)
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .select('title content author authorName createdAt updatedAt');
    
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error fetching announcements' });
  }
});

// Get single announcement (public)
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .select('title content author authorName createdAt updatedAt');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Server error fetching announcement' });
  }
});

// Create announcement (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ message: 'Title and content cannot be empty' });
    }

    const announcement = new Announcement({
      title: title.trim(),
      content: content.trim(),
      author: req.user._id,
      authorName: req.user.username
    });

    await announcement.save();

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error creating announcement' });
  }
});

// Delete announcement (protected - only author can delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if user is the author
    if (announcement.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own announcements' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error deleting announcement' });
  }
});

export default router;

