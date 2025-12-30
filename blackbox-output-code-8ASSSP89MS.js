import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },  // Cloudinary URL
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);