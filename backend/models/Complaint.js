const mongoose = require('mongoose');

const CATEGORIES = [
  'pothole',
  'street_light',
  'water_leakage',
  'garbage_overflow',
  'damaged_road',
  'other',
];

const complaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // Innovation: auto-calculated priority score (higher = more urgent)
    priority: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

complaintSchema.statics.CATEGORIES = CATEGORIES;
module.exports = mongoose.model('Complaint', complaintSchema);
