import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Add comment to post
export const addComment = async (req, res) => {
  const { content, parentComment } = req.body;
  
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const newComment = new Comment({
      content,
      author: req.user.id,
      post: req.params.postId,
      parentComment: parentComment || null // Add parent comment reference if it's a reply
    });
    
    const comment = await newComment.save();
    
    // Populate author info
    await comment.populate('author', 'username');
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get comments for a post
export const getPostComments = async (req, res) => {
  try {
    // Only get top-level comments (no parent comment)
    const comments = await Comment.find({ 
      post: req.params.postId,
      parentComment: null 
    })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if user is the comment author
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to delete this comment' });
    }
    
    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });
    
    await comment.remove();
    
    res.json({ msg: 'Comment and its replies deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ msg: 'Content is required' });
    }
    
    let comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if user is the comment author
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to edit this comment' });
    }
    
    comment.content = content;
    await comment.save();
    
    // Populate author info
    await comment.populate('author', 'username');
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like/unlike a comment
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if already liked
    if (comment.likes.some(like => like.toString() === req.user.id)) {
      // Unlike
      comment.likes = comment.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      comment.likes.unshift(req.user.id);
    }
    
    await comment.save();
    res.json(comment.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get replies for a comment
export const getCommentReplies = async (req, res) => {
  try {
    const replies = await Comment.find({ 
      parentComment: req.params.id 
    })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json(replies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add reply to a comment
export const ReplyComment = async (req, res) => {
  const { content } = req.body;
  
  try {
    const parentComment = await Comment.findById(req.params.id);
    
    if (!parentComment) {
      return res.status(404).json({ msg: 'Parent comment not found' });
    }
    
    const newReply = new Comment({
      content,
      author: req.user.id,
      post: parentComment.post,
      parentComment: req.params.id
    });
    
    const reply = await newReply.save();
    
    // Populate author info
    await reply.populate('author', 'username');
    
    res.json(reply);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};