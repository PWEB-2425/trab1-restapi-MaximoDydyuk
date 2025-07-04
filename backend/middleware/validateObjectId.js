// backend/middleware/validateObjectId.js
import mongoose from 'mongoose';

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  
  next();
};