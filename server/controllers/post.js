import Post from '../models/Post.js';

// Create a post
export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  
  try {
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      tags: tags || []
    });
    
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    let post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update fields
    post.title = title;
    post.content = content;
    post.tags = tags || [];
    
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await post.remove();
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username');
    
    const total = await Post.countDocuments();
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username bio profilePicture');
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
};

// Get posts by tag
export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    
    const posts = await Post.find({ tags: tag })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like/unlike a post
export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if already liked
    if (post.likes.some(like => like.toString() === req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      post.likes.unshift(req.user.id);
    }
    
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Bookmark/unbookmark a post
export const toggleBookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // Check if already bookmarked
    if (post.bookmarks.some(bookmark => bookmark.toString() === req.user.id)) {
      // Remove bookmark
      post.bookmarks = post.bookmarks.filter(bookmark => bookmark.toString() !== req.user.id);
    } else {
      // Add bookmark
      post.bookmarks.unshift(req.user.id);
    }
    
    await post.save();
    res.json(post.bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('author', 'username');
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get posts by user ID
export const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};