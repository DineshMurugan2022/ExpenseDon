import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, reset } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ type }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (type === 'register') {
            dispatch(register(formData));
        } else {
            dispatch(login({ email: formData.email, password: formData.password }));
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 glass neon-border relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-gradient" />

            <h2 className="text-3xl font-bold mb-2 neon-text">
                {type === 'register' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 mb-8">
                {type === 'register' ? 'Join our financial tracking community' : 'Sign in to manage your expenses'}
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
                <AnimatePresence mode='wait'>
                    {type === 'register' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    placeholder="John Doe"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                            required
                        />
                    </div>
                </div>

                {isError && (
                    <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {message}
                    </p>
                )}

                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 242, 255, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-neon-gradient text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className="animate-spin" size={20} /> : (
                        <>
                            {type === 'register' ? 'Sign Up' : 'Sign In'}
                            <ArrowRight size={20} />
                        </>
                    )}
                </motion.button>
            </form>

            <p className="mt-8 text-center text-gray-400">
                {type === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => navigate(type === 'register' ? '/login' : '/register')}
                    className="text-primary hover:underline font-medium"
                >
                    {type === 'register' ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </motion.div>
    );
};

export default AuthForm;
