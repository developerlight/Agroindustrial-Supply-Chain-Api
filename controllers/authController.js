const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/apiResponse');
const Farmer = require('../models/Farmer');
const Distributor = require('../models/Distributor');

// Helper: generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(role, role.length)
    if (!name || !email || !password || !role) {
      return APIResponse.error(res, 'All fields are required', 422);
    }

    // Validasi role
    if (!['farmer', 'distributor', 'admin'].includes(role.toLowerCase())) {
      return APIResponse.error(res, 'Role must be farmer, distributor, or admin', 422);
    }

    // Cek email sudah terdaftar
    let existingUser = null;
    if (role.toLowerCase() === 'farmer') {
      existingUser = await Farmer.findOne({ 'contact.email': email });
    } else if (role.toLowerCase() === 'distributor') {
      existingUser = await Distributor.findOne({ 'contact.email': email });
    }
    // Admin bisa menggunakan table terpisah atau reuse Distributor (opsional)
    if (existingUser) return APIResponse.error(res, 'Email already registered', 422);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user sesuai role
    let user;
    if (role.toLowerCase() === 'farmer') {
      user = await Farmer.create({
        name,
        farmName: `${name}'s farm`,
        contact: { email },
        password: hashedPassword, // tambahkan field password di model Farmer
      });
    } else if (role.toLowerCase() === 'distributor') {
      user = await Distributor.create({
        name,
        type: 'Distributor',
        contact: { email },
        password: hashedPassword, // tambahkan field password di model Distributor
      });
    } else if (role.toLowerCase() === 'admin') {
      // Buat collection Admin atau reuse Distributor dengan role admin
      user = await Distributor.create({
        name,
        type: 'Admin',
        contact: { email },
        password: hashedPassword,
      });
    }

    // Generate token
    const token = generateToken(user);

    return APIResponse.success(res, { token }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return APIResponse.error(res, 'All fields are required', 422);
    }

    // Validasi role
    if (!['farmer', 'distributor', 'admin'].includes(role.toLowerCase())) {
      return APIResponse.error(res, 'Role must be farmer, distributor, or admin', 422);
    }

    // Cari user sesuai role
    let user = null;
    if (role.toLowerCase() === 'farmer') {
      user = await Farmer.findOne({ 'contact.email': email });
    } else if (role.toLowerCase() === 'distributor') {
      user = await Distributor.findOne({ 'contact.email': email, role: role.toLowerCase() });
    } else if (role.toLowerCase() === 'admin') {
      user = await Distributor.findOne({ 'contact.email': email, role: 'admin' });
    }

    if (!user) return APIResponse.unauthorized(res, 'Invalid email or password');

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return APIResponse.unauthorized(res, 'Invalid email or password');

    // Generate token
    const token = generateToken(user);

    return APIResponse.success(res, { token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user diisi oleh authMiddleware
    if (!req.user || !req.user.id || !req.user.role) {
      return APIResponse.unauthorized(res, 'User not authenticated');
    }

    let user = null;

    if (req.user.role === 'farmer') {
      user = await Farmer.findById(req.user.id).select('-password'); // jangan kirim password
    } else if (req.user.role === 'distributor' || req.user.role === 'admin') {
      user = await Distributor.findById(req.user.id).select('-password');
    }

    if (!user) {
      return APIResponse.notFound(res, 'User not found');
    }

    return APIResponse.success(res, user, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user diisi oleh authMiddleware
    if (!req.user || !req.user.id || !req.user.role) {
      return APIResponse.unauthorized(res, 'User not authenticated');
    }

    let user = null;

    if (req.user.role === 'farmer') {
      user = await Farmer.findById(req.user.id).select('-password'); // jangan kirim password
    } else if (req.user.role === 'distributor' || req.user.role === 'admin') {
      user = await Distributor.findById(req.user.id).select('-password');
    }

    if (!user) {
      return APIResponse.notFound(res, 'User not found');
    }

    return APIResponse.success(res, user, 'User profile fetched successfully');
  } catch (error) {
    next(error);
  }
};