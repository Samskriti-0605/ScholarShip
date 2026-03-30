import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (!data) { navigate('/login'); return; }
    const parsed = JSON.parse(data);
    if (parsed.role !== 'admin') { navigate('/login'); return; }
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get('/admin/applications');
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (app_id, action) => {
    try {
      await api.post('/admin/review', { application_id: app_id, action });
      fetchApps();
    } catch (err) {
      alert("Error reviewing application");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen animate-fade-in-up">
      {/* Navbar area */}
      <div className="glass-panel px-8 py-5 flex flex-col md:flex-row justify-between items-center mb-10 sticky top-4 z-50">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 shadow-lg shadow-slate-500/30 flex items-center justify-center">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-900 tracking-tight">Admin & AI Verification</h1>
                <p className="text-sm font-semibold text-slate-500 tracking-wide">Review automated risk scores and route to provider</p>
            </div>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="bg-white text-rose-500 border-2 border-rose-100 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all shadow-sm">Sign Out Exit</button>
      </div>

      <div className="glass-panel p-2 shadow-2xl shadow-indigo-900/10">
        <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 uppercase text-xs tracking-wider font-extrabold">
                  <th className="p-5 border-b border-slate-200">Reg No.</th>
                  <th className="p-5 border-b border-slate-200">Candidate Profile</th>
                  <th className="p-5 border-b border-slate-200">Scholarship Scope</th>
                  <th className="p-5 border-b border-slate-200">Current Phase</th>
                  <th className="p-5 border-b border-slate-200">AI Trust Index</th>
                  <th className="p-5 border-b border-slate-200 text-center">Administrative Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 text-slate-400 font-bold">{a.reg_no}</td>
                    <td className="p-5">
                        <div className="font-extrabold text-slate-800 text-base">{a.student_name}</div>
                        <div className="text-xs text-slate-400 font-semibold uppercase mt-0.5">ID: {a.id} </div>
                    </td>
                    <td className="p-5 text-indigo-700 font-bold">{a.scholarship_name}</td>
                    <td className="p-5">
                      <span className={`px-4 py-1.5 text-xs rounded-full font-black tracking-widest uppercase border ${
                        a.status === 'PROVIDER_PENDING' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        a.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        a.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        a.status === 'FLAGGED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {a.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5">
                        <div className="flex items-center space-x-2">
                            <div className="relative w-full max-w-[100px] h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                                    a.fraud_score <= 30 ? 'bg-emerald-500 w-1/4' : a.fraud_score <= 70 ? 'bg-amber-500 w-1/2' : 'bg-rose-500 w-full'
                                }`}></div>
                            </div>
                            <span className={`text-xs font-black shadow-sm px-2 py-0.5 rounded-md ${
                                a.fraud_score <= 30 ? 'bg-emerald-100 text-emerald-700' : a.fraud_score <= 70 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                                {a.fraud_score}%
                            </span>
                        </div>
                    </td>
                    <td className="p-5 flex justify-center items-center space-x-3 mt-2 md:mt-0">
                      {['PENDING', 'VERIFIED', 'FLAGGED'].includes(a.status) ? (
                        <>
                          <button onClick={() => handleAction(a.id, 'approve')} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-800/20 w-32 outline-none">Pass Forward</button>
                          <button onClick={() => handleAction(a.id, 'reject')} className="bg-white text-rose-600 border-2 border-rose-100 px-4 py-1.5 rounded-xl text-xs font-extrabold hover:bg-rose-50 hover:border-rose-300 transition-colors w-24 outline-none">Reject</button>
                        </>
                      ) : (
                        <span className="text-slate-300 text-xs font-black uppercase tracking-widest flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Evaluated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-slate-400">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <span className="font-bold text-lg tracking-tight">System Empty</span>
                        <p className="text-sm font-medium mt-1">No applications exist in the database.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
