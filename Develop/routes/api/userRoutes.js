const router = require('express').Router();

// Import the userController methods
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend

// require the userController
} = require('../../controllers/userController');

// Set up GET all and POST at /api/users
router.route('/').get(getAllUsers).post(createUser);
// Set up GET one, PUT, and DELETE at /api/users/:id
router.route('/:userId').get(getUserById).put(updateUser).delete(deleteUser);
// Set up POST and DELETE at /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;