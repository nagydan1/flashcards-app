import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema({
  nativeText: {
    type: String,
    required: true,
  },
  foreignText: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

export default mongoose.model('card', CardSchema);
