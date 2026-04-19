const Complaint = require('../models/Complaint');
const { calcPriority } = require('../utils/priority');
const { useCloudinary } = require('../config/cloudinary');

// Build absolute URL for locally stored images
function fileToUrl(req, file) {
  if (!file) return '';
  if (useCloudinary) return file.path; // cloudinary url
  return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
}

// Citizen: create complaint
exports.create = async (req, res) => {
  const { category, description, location } = req.body;
  if (!category || !description || !location)
    return res.status(400).json({ message: 'category, description, location required' });

  const imageUrl = fileToUrl(req, req.file);
  const priority = calcPriority({ category, description, upvotes: 0 });

  const complaint = await Complaint.create({
    user: req.user._id,
    category,
    description,
    location,
    imageUrl,
    priority,
  });
  res.status(201).json(complaint);
};

// Citizen: my complaints
exports.myComplaints = async (req, res) => {
  const list = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
};

// Citizen: upvote (people affected)
exports.upvote = async (req, res) => {
  const c = await Complaint.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (c.upvotedBy.some((u) => u.equals(req.user._id)))
    return res.status(400).json({ message: 'Already upvoted' });
  c.upvotedBy.push(req.user._id);
  c.upvotes += 1;
  c.priority = calcPriority({
    category: c.category,
    description: c.description,
    upvotes: c.upvotes,
  });
  await c.save();
  res.json(c);
};

// Admin: list all (sorted by priority DESC — innovation)
exports.listAll = async (req, res) => {
  const { category, status, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (q) filter.$or = [
    { description: { $regex: q, $options: 'i' } },
    { location: { $regex: q, $options: 'i' } },
  ];

  const list = await Complaint.find(filter)
    .populate('user', 'name email')
    .sort({ priority: -1, createdAt: -1 });
  res.json(list);
};

// Admin: update status
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'In Progress', 'Resolved'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  const c = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json(c);
};

// Admin: delete
exports.remove = async (req, res) => {
  const c = await Complaint.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

exports.categories = (_req, res) => res.json(Complaint.CATEGORIES);
