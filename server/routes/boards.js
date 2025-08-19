const express = require('express');
const Board = require('../models/Board');
const User = require('../models/User');
const { isAuthenticated, isBoardOwner, hasBoardAccess, canEditBoard } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/boards
// @desc    Get all boards for the authenticated user
// @access  Private
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get boards owned by user
    const ownedBoards = await Board.find({ owner: req.user._id })
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('lastModifiedBy', 'name email')
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get boards where user is a collaborator
    const collaborativeBoards = await Board.find({ 
      'collaborators.user': req.user._id 
    })
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('lastModifiedBy', 'name email')
      .sort({ lastModified: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total counts
    const ownedCount = await Board.countDocuments({ owner: req.user._id });
    const collaborativeCount = await Board.countDocuments({ 'collaborators.user': req.user._id });
    
    res.json({
      success: true,
      data: {
        ownedBoards,
        collaborativeBoards,
        pagination: {
          page,
          limit,
          ownedTotal: ownedCount,
          collaborativeTotal: collaborativeCount,
          ownedPages: Math.ceil(ownedCount / limit),
          collaborativePages: Math.ceil(collaborativeCount / limit),
        }
      }
    });
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/boards
// @desc    Create a new board
// @access  Private
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, settings } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Board title is required' });
    }
    
    const board = new Board({
      title: title.trim(),
      description: description?.trim() || '',
      owner: req.user._id,
      settings: {
        isPublic: settings?.isPublic || false,
        allowComments: settings?.allowComments !== false,
        theme: settings?.theme || 'light',
      },
      lastModifiedBy: req.user._id,
    });
    
    await board.save();
    
    // Add board to user's boards array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { boards: board._id }
    });
    
    // Populate the created board
    await board.populate('owner', 'name email avatar');
    
    res.status(201).json({
      success: true,
      message: 'Board created successfully',
      board
    });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/boards/:boardId
// @desc    Get a specific board
// @access  Private (with board access)
router.get('/:boardId', isAuthenticated, hasBoardAccess, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('collaborators.addedBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .populate('elements.createdBy', 'name email');
    
    res.json({
      success: true,
      board,
      userRole: req.userRole,
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/boards/:boardId
// @desc    Update board details
// @access  Private (board owner only)
router.put('/:boardId', isAuthenticated, isBoardOwner, async (req, res) => {
  try {
    const { title, description, settings } = req.body;
    
    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ message: 'Board title cannot be empty' });
      }
      req.board.title = title.trim();
    }
    
    if (description !== undefined) {
      req.board.description = description.trim();
    }
    
    if (settings) {
      if (settings.isPublic !== undefined) req.board.settings.isPublic = settings.isPublic;
      if (settings.allowComments !== undefined) req.board.settings.allowComments = settings.allowComments;
      if (settings.theme !== undefined) req.board.settings.theme = settings.theme;
    }
    
    await req.board.updateLastModified(req.user._id);
    await req.board.populate('owner', 'name email avatar');
    
    res.json({
      success: true,
      message: 'Board updated successfully',
      board: req.board
    });
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/boards/:boardId
// @desc    Delete a board
// @access  Private (board owner only)
router.delete('/:boardId', isAuthenticated, isBoardOwner, async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.boardId);
    
    // Remove board from all users' boards arrays
    await User.updateMany(
      { boards: req.params.boardId },
      { $pull: { boards: req.params.boardId } }
    );
    
    // Remove board from collaborations
    await User.updateMany(
      { 'collaborations.boardId': req.params.boardId },
      { $pull: { collaborations: { boardId: req.params.boardId } } }
    );
    
    res.json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/boards/:boardId/elements
// @desc    Get board elements (canvas data)
// @access  Private (board viewer, editor, or owner)
router.get('/:boardId/elements', isAuthenticated, hasBoardAccess, async (req, res) => {
  try {
    const { page = 1, limit = 100, type, lastModified } = req.query;
    
    // Get board with elements
    const board = await Board.findById(req.params.boardId)
      .populate('elements.createdBy', 'name email avatar');
    
    if (!board) {
      return res.status(404).json({ 
        success: false, 
        message: 'Board not found' 
      });
    }

    // Filter elements based on query parameters
    let elements = board.elements || [];

    // Filter by element type if specified
    if (type) {
      elements = elements.filter(element => element.type === type);
    }

    // Filter by last modified date if specified
    if (lastModified) {
      const filterDate = new Date(lastModified);
      elements = elements.filter(element => 
        new Date(element.updatedAt || element.createdAt) > filterDate
      );
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const paginatedElements = elements.slice(skip, skip + limitNum);

    // Prepare response
    res.json({
      success: true,
      data: {
        boardId: board._id,
        boardTitle: board.title,
        elements: paginatedElements,
        pagination: {
          current: pageNum,
          limit: limitNum,
          total: elements.length,
          pages: Math.ceil(elements.length / limitNum)
        },
        metadata: {
          lastModified: board.lastModified,
          userRole: req.userRole,
          elementTypes: [...new Set(elements.map(el => el.type))],
          totalElements: board.elements.length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching board elements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// @route   PUT /api/boards/:boardId/elements
// @desc    Update board elements (canvas data)
// @access  Private (board editor or owner)
router.put('/:boardId/elements', isAuthenticated, canEditBoard, async (req, res) => {
  try {
    const { elements } = req.body;
    
    if (!Array.isArray(elements)) {
      return res.status(400).json({ message: 'Elements must be an array' });
    }
    
    req.board.elements = elements.map(element => ({
      ...element,
      createdBy: element.createdBy || req.user._id,
      updatedAt: new Date(),
    }));
    
    await req.board.updateLastModified(req.user._id);
    
    res.json({
      success: true,
      message: 'Board elements updated successfully',
      elements: req.board.elements
    });
  } catch (error) {
    console.error('Error updating board elements:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/boards/:boardId/collaborators
// @desc    Add collaborator to board
// @access  Private (board owner only)
router.post('/:boardId/collaborators', isAuthenticated, isBoardOwner, async (req, res) => {
  try {
    const { email, role = 'viewer' } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!['editor', 'viewer'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be editor or viewer' });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }
    
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as collaborator' });
    }
    
    // Add collaborator to board
    await req.board.addCollaborator(user._id, role, req.user._id);
    
    // Add collaboration to user's profile
    await User.findByIdAndUpdate(user._id, {
      $push: {
        collaborations: {
          boardId: req.board._id,
          role: role,
          joinedAt: new Date(),
        }
      }
    });
    
    await req.board.populate('collaborators.user', 'name email avatar');
    
    res.json({
      success: true,
      message: 'Collaborator added successfully',
      collaborators: req.board.collaborators
    });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/boards/:boardId/collaborators/:userId
// @desc    Remove collaborator from board
// @access  Private (board owner only)
router.delete('/:boardId/collaborators/:userId', isAuthenticated, isBoardOwner, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Remove collaborator from board
    await req.board.removeCollaborator(userId);
    
    // Remove collaboration from user's profile
    await User.findByIdAndUpdate(userId, {
      $pull: {
        collaborations: { boardId: req.board._id }
      }
    });
    
    res.json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
