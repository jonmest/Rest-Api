const express = require('express')
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/admin')

const { protect, authorize } = require('../middleware/auth')

const router = express.Router();

router.route('/')
    .get( protect, authorize('publisher'), getPosts)
    .post( protect, authorize('publisher'), createPost)

router
    .route('/:titleSlug')
    .get( protect, authorize('publisher'), getPost)
    .put( protect, authorize('publisher'), updatePost)
    .delete( protect, authorize('publisher'), deletePost)

module.exports = router