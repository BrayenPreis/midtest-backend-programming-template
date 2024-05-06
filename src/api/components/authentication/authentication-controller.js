const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Mengambil informasi percobaan login dari authentication service
      const loginAttemptInfo =
        authenticationServices.getLoginAttemptInfo(email);

      // Kalau terdapat informasi percobaan login dan telah melebihi batas percobaan login
      if (loginAttemptInfo && loginAttemptInfo.count >= 5) {
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          'Terlalu banyak percobaan yang salah. silahkan dicoba beberapa saat lagi.'
        );
      }

      // Jika tidak, tanggapi dengan pesan default
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'email atau password salah'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
