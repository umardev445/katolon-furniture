import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, LogIn, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: name,
          email: email,
          role: email === 'cricket34136@gmail.com' ? 'admin' : 'user', // Set requester as admin
          createdAt: new Date().toISOString()
        });
        toast.success('Registration successful!');
      }
      navigate(redirect);
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        role: result.user.email === 'cricket34136@gmail.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      }, { merge: true });
      toast.success('Successfully logged in with Google');
      navigate(redirect);
    } catch (err: any) {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[2.5rem] border border-[#E5E1DA] shadow-2xl space-y-10"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-[#F5F2EE] rounded-2xl mb-4">
            <Heart className="h-6 w-6 text-[#A67B5B]" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C1810]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#8E7F71] text-sm">Katolon Furniture Premium Experience</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <AnimatePresence mode='wait'>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A67B5B]" />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/10 focus:outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A67B5B]" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/10 focus:outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#8E7F71] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A67B5B]" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E5E1DA] focus:ring-2 focus:ring-[#5C4033]/10 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C4033] text-white py-5 rounded-2xl font-bold hover:bg-[#4A3329] transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : (
              <>
                <LogIn className="h-5 w-5" />
                <span>{isLogin ? 'Login' : 'Signup'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E1DA]"></div></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-[#8E7F71]">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-[#E5E1DA] text-[#2C1810] py-4 rounded-2xl font-bold hover:bg-[#F5F2EE] transition-all flex items-center justify-center space-x-3 shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="h-5 w-5" />
          <span>Google Account</span>
        </button>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-[#5C4033] hover:underline"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
