const { Thought, User } = require('../models');

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by its _id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST a new thought
  createThought(req, res) {
    // create a new thought using the Thought model and the data from the request body
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // PUT to update a thought by its _id
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, {$set: req.body}, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // DELETE to remove a thought by its _id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: dbThoughtData.userId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            });
        }
    };

    module.exports = thoughtController;