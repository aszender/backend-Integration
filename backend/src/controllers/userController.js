const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log('📋 Fetching all users...');
    const users = await User.find();
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    console.log(`📋 Fetching user with ID: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('✅ User found:', user.name);
    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log('📝 Creating new user:', { name, email });
    
    if (!name || !email) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    
    const user = new User({ name, email });
    await user.save();
    console.log('✅ User created successfully:', user._id);
    res.status(201).json(user);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(`📝 Updating user with ID: ${req.params.id}`, { name, email });
    
    if (!name || !email) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    
    if (!user) {
      console.log('❌ User not found for update');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User updated successfully');
    res.json(user);
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    console.log(`🗑️ Deleting user with ID: ${req.params.id}`);
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      console.log('❌ User not found for deletion');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User deleted successfully');
    res.json(user);
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
}; 