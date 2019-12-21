const express = require('express')
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/posts')

const { protect, authorize } = require('../middleware/auth')

const router = express.Router();

router.route('/')
    .get(getPosts)

router
    .route('/:titleSlug')
    .get(getPost)

module.exports = router