const { Thought, User } = require("../models");
const { add } = require("../models/Reaction");

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by its _id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST to create a new thought 
  createThought(req, res) {
    // create a new thought using the Thought model and the data from the request body
    Thought.create(req.body)
      .then((createThought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: createThought._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Update thought by its _id
  updateThought(req, res) {
    // update a thought using the Thought model and the data from the request body
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId }, 
        { $set: req.body },
        { runValidators: true, new: true })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought found with that id' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
},

  // Delete thought by its _id
  deleteThought(req, res) {
    // delete a thought using the Thought model and the data from the request body
    Thought.deleteOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with that id" })
          : res.status(200).json({ message: "Thought successfully deleted" })
      )
      .catch((err) => res.status(500).json(err));
  },

  // POST to create a reaction stored in a single thought's reactions array field
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        } else {
          res.json(dbThoughtData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        } else {
          res.json(dbThoughtData);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
module.exports = thoughtController;
