const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// menambahkan objek untuk melacak percobaan login
const loginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // Periksa apakah ada percobaan login sebelumnya untuk email ini
  const attemptInfo = loginAttempts[email] || { count: 0, lastAttempt: 0 };

  // Reset counter saat sudah melewati batas waktu
  if (
    attemptInfo.lastAttempt > 0 &&
    Date.now() - attemptInfo.lastAttempt > 30 * 60 * 1000
  ) {
    attemptInfo.count = 0;
  }

  // menambahkan informasi tentang percobaan login saat ini
  attemptInfo.lastAttempt = Date.now();
  attemptInfo.count++;
  loginAttempts[email] = attemptInfo;

  // Karena selalu memeriksa password, definisikan percobaan login sebagai berhasil
  if (user && (await passwordMatched(password, user.password))) {
    // Reset counter jika login berhasil
    delete loginAttempts[email];
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
