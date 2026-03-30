import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    student_id: '', name: '', email: '', phone: '', password: '',
    income: '', marks: '', category: 'General', course: '', state: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData, role };
      if (isLogin) {
        const res = await api.post('/login', { student_id: payload.student_id, password: payload.password, role });
        localStorage.setItem('user', JSON.stringify(res.data));
        if (res.data.role === 'admin') navigate('/admin');
        else if (res.data.role === 'provider') navigate('/provider');
        else navigate('/student');
      } else {
        const res = await api.post('/register', payload);
        setIsLogin(true);
        alert(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-10 animate-fade-in-up transition-all duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-6 shadow-xl shadow-purple-500/30 transform hover:scale-105 transition duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" /></svg>
          </div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 mt-3 text-sm font-medium">{isLogin ? 'Log in to securely manage your scholarships and applications.' : 'Select your role to get started.'}</p>
        </div>

        <div className="flex justify-center mb-8 space-x-2 bg-slate-100/50 p-1.5 rounded-2xl backdrop-blur-sm border border-white/60 shadow-inner">
          {['student', 'admin', 'provider'].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-bold capitalize rounded-xl transition-all duration-300 ${
                role === r ? 'bg-white text-indigo-700 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'
              }`}>
              {r}
            </button>
          ))}
        </div>

        {error && <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl text-sm font-semibold flex items-center shadow-sm animate-pulse">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
        </div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <input className="w-full px-5 py-3.5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-transparent peer text-slate-700 font-medium shadow-sm hover:shadow-md" 
                   id="student_id" placeholder="ID" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} required/>
            <label htmlFor="student_id" className="absolute left-5 top-3.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-indigo-600 font-bold uppercase tracking-wider">User ID</label>
          </div>
          
          <div className="relative">
            <input className="w-full px-5 py-3.5 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder-transparent peer text-slate-700 font-medium shadow-sm hover:shadow-md" 
                   type="password" id="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required/>
            <label htmlFor="password" className="absolute left-5 top-3.5 text-slate-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-[11px] peer-focus:text-indigo-600 font-bold uppercase tracking-wider">Password</label>
          </div>
          
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up mt-2">
              <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all col-span-2 text-sm font-medium shadow-sm" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              
              {role === 'student' && (
                <>
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all col-span-2 text-sm font-medium shadow-sm" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all col-span-2 text-sm font-medium shadow-sm" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm" type="number" placeholder="Family Income (₹)" value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} required/>
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm" type="number" step="0.01" placeholder="Marks (%)" value={formData.marks} onChange={e => setFormData({...formData, marks: e.target.value})} required/>
                  <select className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm text-slate-600" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>General</option><option>OBC</option><option>SC/ST</option>
                  </select>
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm" placeholder="Course" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required/>
                  <input className="w-full px-5 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all col-span-2 text-sm font-medium shadow-sm" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required/>
                </>
              )}
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-extrabold text-lg shadow-xl shadow-indigo-500/40 transform hover:-translate-y-1 transition duration-300 flex justify-center items-center group">
                {loading ? <span className="animate-pulse">Processing...</span> : (isLogin ? 'Sign In Securely' : 'Complete Registration')}
                {!loading && <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          {isLogin ? "New to the platform? " : "Already registered? "}
          <button type="button" onClick={() => {setIsLogin(!isLogin); setError('');}} className="text-indigo-600 font-bold hover:text-purple-600 transition-colors ml-1 hover:underline decoration-2 underline-offset-4">
            {isLogin ? 'Create an account' : 'Log in here'}
          </button>
        </p>
      </div>
    </div>
  );
}
