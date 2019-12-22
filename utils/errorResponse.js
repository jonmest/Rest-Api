/**
 * Creates a custom error response
 * @class ErrorResponse
 */
class ErrorResponse extends Error {
  /**
   *Creates an instance of ErrorResponse.
   * @param {string} message
   * @param {number} statusCode
   * @memberof ErrorResponse
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
