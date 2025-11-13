import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// Create new comment or reply
export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = await Comment.create({
      content,
      author: req.user.id,
      post: postId,
      parentComment: parentCommentId || null,
    });

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $inc: { repliesCount: 1 },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $inc: { commentsCount: 1 },
      });
    }

    const populatedComment = await Comment.findById(comment._id).populate('author', 'username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a post with pagination and sorting
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'recent';
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === 'liked') {
      sortOption = { likesCount: -1, createdAt: -1 };
    }

    const total = await Comment.countDocuments({ post: postId, parentComment: null });
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      comments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get replies for a comment
export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || 'recent';
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (sort === 'liked') {
      sortOption = { likesCount: -1, createdAt: -1 };
    }

    const total = await Comment.countDocuments({ parentComment: commentId });
    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'username avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      replies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update comment (author only)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content || comment.content;
    comment.isEdited = true;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate('author', 'username avatar');

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment (author or admin only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 },
      });
    } else {
      await Post.findByIdAndUpdate(comment.post, {
        $inc: { commentsCount: -1 },
      });
    }

    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle like on comment
export const toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.likesCount += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.likesCount -= 1;
    }

    await comment.save();

    res.json({
      liked: userIndex === -1,
      likesCount: comment.likesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users who liked a comment
export const getLikes = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('likes', 'username avatar');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
