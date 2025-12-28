const mongoose = require('mongoose');

// In-memory fallback
let inMemoryUsers = [];
let nextId = 1;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

// Add in-memory methods
UserModel.findInMemory = () => Promise.resolve(inMemoryUsers);
UserModel.findByIdInMemory = (id) => Promise.resolve(inMemoryUsers.find(u => u._id == id) || null);
UserModel.createInMemory = (data) => {
  const user = { _id: nextId++, ...data };
  inMemoryUsers.push(user);
  return Promise.resolve(user);
};
UserModel.findByIdAndUpdateInMemory = (id, update) => {
  const user = inMemoryUsers.find(u => u._id == id);
  if (user) {
    Object.assign(user, update);
    return Promise.resolve(user);
  }
  return Promise.resolve(null);
};
UserModel.findByIdAndDeleteInMemory = (id) => {
  const index = inMemoryUsers.findIndex(u => u._id == id);
  if (index !== -1) {
    const user = inMemoryUsers[index];
    inMemoryUsers.splice(index, 1);
    return Promise.resolve(user);
  }
  return Promise.resolve(null);
};

module.exports = UserModel; 