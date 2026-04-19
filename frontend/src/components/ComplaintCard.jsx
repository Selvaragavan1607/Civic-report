const STATUS_CLASS = {
  'Pending': 'badge-pending',
  'In Progress': 'badge-progress',
  'Resolved': 'badge-resolved',
};
const CATEGORY_LABEL = {
  pothole: 'Pothole',
  street_light: 'Street Light',
  water_leakage: 'Water Leakage',
  garbage_overflow: 'Garbage Overflow',
  damaged_road: 'Damaged Road',
  other: 'Other',
};

export default function ComplaintCard({ complaint, isAdmin, onStatus, onDelete, onUpvote }) {
  const c = complaint;
  return (
    <div className="card">
      {c.imageUrl && <img className="complaint-img" src={c.imageUrl} alt={c.category} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{CATEGORY_LABEL[c.category] || c.category}</strong>
        <span className={`badge ${STATUS_CLASS[c.status]}`}>{c.status}</span>
      </div>
      <p style={{ margin: '8px 0' }}>{c.description}</p>
      <p className="muted">📍 {c.location}</p>
      <p className="muted">
        🕒 {new Date(c.createdAt).toLocaleString()}
        {c.upvotes > 0 && <> · 👍 {c.upvotes}</>}
        {c.priority >= 12 && <> · <span className="badge badge-priority">High Priority</span></>}
      </p>
      {isAdmin && c.user?.name && <p className="muted">By: {c.user.name} ({c.user.email})</p>}

      {!isAdmin && onUpvote && (
        <button className="btn btn-sm btn-outline" onClick={() => onUpvote(c._id)}>👍 Upvote</button>
      )}

      {isAdmin && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <select
            className="select"
            style={{ flex: 1 }}
            value={c.status}
            onChange={(e) => onStatus(c._id, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(c._id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
