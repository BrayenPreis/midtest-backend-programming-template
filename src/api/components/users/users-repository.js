const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {number} page_number - Nomor halaman yang akan ditampilkan
 * @param {number} page_size - Jumlah data yang akan dimunculkan per halaman
 * @param {string} sort - Pengurutan data dalam format <field name>:<sort order>
 * @param {string} search - Filter pencarian dalam format <field name>:<search key>
 * @returns {Promise}
 */
async function getUsers(
  page_number = 1,
  page_size = 10,
  sort = 'email:asc',
  search
) {
  const [field, order] = sort.split(':');
  const sortParams = { [field]: order === 'desc' ? -1 : 1 };

  const query = search
    ? { [search.split(':')[0]]: new RegExp(search.split(':')[1], 'i') }
    : {};

  const totalUsers = await User.countDocuments(query);
  const total_pages = Math.ceil(totalUsers / page_size);
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  const users = await User.find(query)
    .sort(sortParams)
    .skip((page_number - 1) * page_size)
    .limit(page_size);

  return {
    page_number,
    page_size,
    count: users.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: users,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
