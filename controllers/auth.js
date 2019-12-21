const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

    sendTokenResponse(user, 200, res)

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

/**
 * @desc    Log user out clear cookie
 * @route   GET /auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        data: {}
    })
})

/**
 * @desc    Forgot password
 * @route   POST /auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    const message = `Make PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })
        res.status(200).json({ success: true })
    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('Email couldnt be sent', 500))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * @desc    Reset password
 * @route   PUT /auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')
     
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('invalid token', 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponse(user, 200, res)

})