import { useEffect, useState } from 'react';
import api from '../api/axios';
import ComplaintCard from '../components/ComplaintCard';

export default function UserDashboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/api/complaints/me');
    setList(data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const upvote = async (id) => {
    try { await api.post(`/api/complaints/${id}/upvote`); load(); }
    catch (e) { alert(e.response?.data?.message || 'Failed'); }
  };

  return (
    <>
      <h2>My Complaints</h2>
      {loading && <p>Loading...</p>}
      {!loading && list.length === 0 && (
        <div className="card"><p>No complaints yet. Click <strong>+ Report</strong> to submit one.</p></div>
      )}
      <div className="grid grid-2">
        {list.map((c) => (
          <ComplaintCard key={c._id} complaint={c} onUpvote={upvote} />
        ))}
      </div>
    </>
  );
}
