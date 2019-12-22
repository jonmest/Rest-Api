const express = require('express')
const {
    getPosts,
    getPost,
} = require('../controllers/posts')

const router = express.Router();

router.route('/')
    .get(getPosts)

router
    .route('/:titleSlug')
    .get(getPost)

module.exports = router