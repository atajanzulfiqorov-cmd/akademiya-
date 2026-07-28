const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../utils/fileHandler');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const users = await readData('users.json');

    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'Ushbu email bilan ro‘yxatdan o‘tilgan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: role === 'instructor' ? 'instructor' : 'student',
      avatar: null
    };

    users.push(newUser);
    await writeData('users.json', users);

    res.status(201).json({ message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readData('users.json');

    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Email yoki parol noto‘g‘ri' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const users = await readData('users.json');
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const users = await readData('users.json');
    const index = users.findIndex(u => u.id === req.user.id);

    if (index === -1) return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });

    if (req.body.name) users[index].name = req.body.name;
    if (req.file) users[index].avatar = `/uploads/${req.file.filename}`;

    await writeData('users.json', users);
    const { password, ...updatedUser } = users[index];
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };