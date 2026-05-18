// utils/apiResponse.js

class APIResponse {
  /**
   * Success response dengan data
   * @param {*} res
   * @param {*} data
   * @param {string} message
   * @param {number} code
   */
  static success(res, data = null, message = 'Success', code = 200) {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Success response tanpa data (misal operasi DELETE berhasil)
   */
  static successMessage(res, message = 'Success', code = 200) {
    return res.status(code).json({
      success: true,
      message,
    });
  }

  /**
   * Response error client (bad request, validation)
   */
  static error(res, message = 'Error', code = 400, errors = null) {
    return res.status(code).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * Unauthorized (401)
   */
  static unauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  /**
   * Forbidden (403)
   */
  static forbidden(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  /**
   * Not found (404)
   */
  static notFound(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  /**
   * Server error (500)
   */
  static serverError(res, error = 'Server Error') {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }

  /**
   * Response dengan pagination / meta
   */
  static paginated(res, data = [], meta = {}, message = 'Success', code = 200) {
    return res.status(code).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  /**
   * Custom response fleksibel
   */
  static custom(res, { success = true, message = '', data = null, code = 200, errors = null }) {
    return res.status(code).json({ success, message, data, errors });
  }
}

module.exports = APIResponse;