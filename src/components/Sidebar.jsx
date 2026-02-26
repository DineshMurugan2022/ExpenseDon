import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, Settings, LogOut, TrendingUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 h-screen glass border-r border-white/5 flex flex-col p-6 sticky top-0"
        >
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-neon-gradient rounded-xl flex items-center justify-center shadow-neon-blue">
                    <TrendingUp className="text-black" size={24} />
                </div>
                <h1 className="text-xl font-bold neon-text text-primary">FinTrack</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <motion.button
                        key={item.label}
                        whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${location.pathname === item.path ? 'bg-white/10 text-primary border-r-2 border-primary' : 'text-gray-400'
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 mb-6 p-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.user?.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.user?.email}</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ x: 5, color: '#ef4444' }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-3 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
