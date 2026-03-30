import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ProviderDashboard() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', eligibility_criteria: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (!data) { navigate('/login'); return; }
    const parsed = JSON.parse(data);
    if (parsed.role !== 'provider') { navigate('/login'); return; }
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data.applications.filter(a => a.status === 'PROVIDER_PENDING'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (app_id, action) => {
    try {
      if (window.confirm(`Are you absolutely sure you want to ${action} this application? This is a final unchangeable sign-off.`)) {
        await api.post('/provider/final-approval', { application_id: app_id, action });
        fetchApps();
      }
    } catch (err) {
      alert("Error processing decision");
    }
  };

  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/scholarships', formData);
      alert('Scholarship created successfully!');
      setShowForm(false);
      setFormData({ name: '', description: '', eligibility_criteria: '', amount: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating scholarship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen animate-fade-in-up">
      {/* Navbar area */}
      <div className="glass-panel px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-10 sticky top-4 z-50">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-cyan-700 tracking-tight">Provider Terminal</h1>
                <p className="text-sm font-semibold text-slate-500 tracking-wide">Final sanction and fund disbursement desk</p>
            </div>
        </div>
        <div className="flex space-x-3">
            <button onClick={() => setShowForm(!showForm)} className="bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-md">
                {showForm ? 'View Applications' : '+ New Scholarship'}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-white text-rose-500 border-2 border-rose-100 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm">Sign Out Close</button>
        </div>
      </div>

      {showForm ? (
        <div className="glass-panel p-8 shadow-2xl shadow-cyan-900/10 border-t-8 border-cyan-500 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-slate-800 mb-6">Publish New Scholarship Scheme</h2>
          <form onSubmit={handleCreateScholarship} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Scholarship Title</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-slate-700 font-medium" placeholder="e.g. Merit Plus Grant" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Grant Value (₹)</label>
              <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-slate-700 font-medium" placeholder="e.g. 75000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Eligibility Criteria</label>
              <input required value={formData.eligibility_criteria} onChange={e => setFormData({...formData, eligibility_criteria: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-slate-700 font-medium" placeholder="e.g. Income < 50000 and Marks > 80" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Detailed Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-sm text-slate-700 h-28 resize-none font-medium" placeholder="Outline specific details, background, and requirements here..."></textarea>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-slate-800 text-white px-6 py-4 rounded-xl font-black tracking-widest uppercase hover:bg-slate-900 transition-all shadow-xl hover:shadow-cyan-900/20 outline-none flex justify-center items-center mt-6">
                {loading ? 'Broadcasting...' : 'Publish Scholarship'}
            </button>
          </form>
        </div>
      ) : (
      <div className="glass-panel p-2 shadow-2xl shadow-cyan-900/10 border-t-8 border-cyan-500">
        <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-100">
          {applications.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
                <div className="bg-slate-50 p-6 rounded-full mb-6">
                    <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-2xl font-extrabold text-slate-800 tracking-tight">Clear Queue</p>
                <p className="text-slate-500 font-medium mt-2">There are currently no applications escalated from Admin requiring a final sanction.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs tracking-wider font-extrabold backdrop-blur-sm">
                  <th className="p-6 border-b border-slate-200">System Trace</th>
                  <th className="p-6 border-b border-slate-200">Approved Beneficiary</th>
                  <th className="p-6 border-b border-slate-200">Fund Category</th>
                  <th className="p-6 border-b border-slate-200 text-center">Irrevocable Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map(a => (
                  <tr key={a.id} className="hover:bg-cyan-50/30 transition-colors group">
                    <td className="p-6">
                        <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-md text-sm">{a.reg_no}</span>
                    </td>
                    <td className="p-6 font-black text-slate-800 text-lg tracking-tight">
                        {a.student_name}
                    </td>
                    <td className="p-6">
                        <div className="inline-flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="font-extrabold text-slate-700">{a.scholarship_name}</span>
                        </div>
                    </td>
                    <td className="p-6 flex justify-center items-center space-x-4">
                        <button onClick={() => handleAction(a.id, 'approve')} className="relative overflow-hidden group/btn bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-black tracking-wide hover:bg-cyan-700 shadow-xl shadow-cyan-600/30 transition-all outline-none flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            Sanction Funds
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-white/10"></div>
                        </button>
                        <button onClick={() => handleAction(a.id, 'reject')} className="bg-white text-rose-500 border-2 border-rose-200 px-6 py-2 rounded-xl font-extrabold hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 shadow-md transition-all outline-none">
                            Veto
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
