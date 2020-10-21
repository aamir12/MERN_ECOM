import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      req.user = user;
      next();
    } catch (error) {
      res.status(404);
      throw new Error('Not authorize, Failed token');
    }
  } else {
    res.status(404);
    throw new Error('Not authorize,token not found');
  }
});

const admin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not Authorized As Admin.');
  }
};

export { protect, admin };
