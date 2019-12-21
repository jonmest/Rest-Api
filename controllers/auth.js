const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

/**
 * @desc    Register user
 * @route   POST /auth/register
 * @access  Public
 */

exports.register = asyncHandler( async (req, res, next) => {
    const { name, email, password, role } = req.body


    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // Create token
    const token = user.getSignedJwtToken()

    res.status(200).json({
        success: true,
        token
    })
})


/**
 * @desc    Login user
 * @route   POST /auth/login
 * @access  Public
 */

exports.login = asyncHandler( async (req, res, next) => {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    // Check for user
    const user = await User.findOne({
        email: email
    }).select('+password')

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    // check if pwd matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }

    sendTokenResponse(user, 200, res)
})

// get token from model create cookie send response
const sendTokenResponse = (user, statusCode, res) => {
        // Create token
        const token = user.getSignedJwtToken()
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        if (process.env.NODE_ENV === 'production') {
            options.secure = true
        }

        res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

/**
 * @desc    Get current logged in user
 * @route   POST /auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})