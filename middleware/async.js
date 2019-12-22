 /**
  * Wrapper for async functions
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 */
const asynchandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asynchandler;
