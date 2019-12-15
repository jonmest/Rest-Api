/**
 * @desc    Get all Bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

/**
 * @desc    Get a single Bootcamp
 * @route   GET /api/v1/bootcamps/:id
 * @access  Public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show one bootcamp" });
};

/**
 * @desc    Create a new Bootcamp
 * @route   POST /api/v1/bootcamps
 * @access  Private
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Create new bootcamp" });
};

/**
 * @desc    Update a new Bootcamp
 * @route   PUT /api/v1/bootcamps/:id
 * @access  Private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Update a bootcamp" });
};

/**
 * @desc    Delete a new Bootcamp
 * @route   DELETE /api/v1/bootcamps/:id
 * @access  Private
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Delete a bootcamp" });
};
