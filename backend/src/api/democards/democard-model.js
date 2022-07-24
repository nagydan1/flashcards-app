import mongoose from 'mongoose';

const DemoCardSchema = new mongoose.Schema({
  nativeText: {
    type: String,
    required: true,
  },
  foreignText: {
    type: String,
    required: true,
  },
});

export default mongoose.model('democard', DemoCardSchema);
