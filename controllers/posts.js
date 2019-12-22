const Post = require('../models/Post')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require("../middleware/async.js");

// @desc      Get all PUBLISHED posts
// @route     GET /api/v1/posts
// @access    Public
exports.getPosts = asyncHandler(async (req, res, next) => {
    let query

    // Copy request query
    const reqQuery = { ...req.query }

    // Fields to include
    const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  // Only fetch published posts
  reqQuery.published = true

  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
  
  // Finding resource
  query = Post.find(JSON.parse(queryStr))
  
// Select fields
if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
    }
    
// Sort
if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
} else {
    query = query.sort('-createdAt')
}

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Post.countDocuments()
  
  query = query.skip(startIndex).limit(limit)

  // Executing query
  const posts = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page -1,
      limit
    }
  }

  res
    .status(200)
    .json({ success: true, count: posts.length, pagination: pagination, data: posts });

})

// @desc      Get single PUBLISHED post
// @route     GET /api/v1/posts/:titleSlug
// @access    Public
exports.getPost = asyncHandler(async (req, res, next) => {
    const post = await Post.findOne({
        slug: req.params.titleSlug
    })

    if (!post) {
        return next(
            new ErrorResponse('Post not found with this slug', 404)
        )
    }
    if (post.published === false) {
      return next(
        new ErrorResponse('Post not publicly available', 403)
      )
    }

    res.status(200).json({
        success: true,
        data: post
    })
})
