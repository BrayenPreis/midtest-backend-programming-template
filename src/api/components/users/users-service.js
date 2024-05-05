const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};

// Contoh User Data
const users = [
  { id: 1, name: 'Johni', email: 'johni@example.com' },
  { id: 2, name: 'Hana', email: 'hana@example.com' },
  { id: 3, name: 'Dadang', email: 'dadang@example.com' },
  { id: 4, name: 'Acep', email: 'acep@test.com' },
  { id: 5, name: 'Bob', email: 'bob@test.com' },
  { id: 6, name: 'Charlie', email: 'charlie@example.com' },
  { id: 7, name: 'Eveline', email: 'eveline@test.com' },
  { id: 8, name: 'Jack', email: 'jack@example.com' },
];

// Fungsi filter berdasarkan kriteria pencarian
function filterUsers(users, searchTerm) {
  if (!searchTerm) return users;
  return users.filter((user) => user.email.includes(searchTerm));
}

// Fungsi sorting
function sortUsers(users, sortBy, sortOrder) {
  return users.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

// Fungsi pagination
function paginateUsers(users, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  return users.slice(startIndex, startIndex + pageSize);
}

// Contoh penggunaan
const searchTerm = 'test';
const sortBy = 'email';
const sortOrder = 'desc';
const pageNumber = 1;
const pageSize = 5;

const filteredUsers = filterUsers(users, searchTerm);
const sortedUsers = sortUsers(filteredUsers, sortBy, sortOrder);
const paginatedUsers = paginateUsers(sortedUsers, pageNumber, pageSize);

console.log(paginatedUsers);
