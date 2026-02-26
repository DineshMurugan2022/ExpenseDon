import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../store/authSlice';
import { upsertBudget, getBudgets } from '../store/budgetSlice';
import { getRecurring } from '../store/recurringSlice';
import { getDebts } from '../store/debtSlice';
import RecurringList from '../components/RecurringList';
import DebtTracker from '../components/DebtTracker';
import {
    Settings as SettingsIcon,
    User,
    Mail,
    Shield,
    Bell,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Target,
    Save,
    CalendarRange,
    TrendingDown as TrendingDownIcon,
    IndianRupee
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];

const Settings = () => {
    const dispatch = useDispatch();
    const { user, isLoading: authLoading, isSuccess: authSuccess, isError: authError, message: authMessage } = useSelector((state) => state.auth);
    const { budgets } = useSelector((state) => state.budgets);
    const { recurring } = useSelector((state) => state.recurring);
    const { debts } = useSelector((state) => state.debts);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currency: 'INR',
    });

    const [budgetData, setBudgetData] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        dispatch(getBudgets());
        dispatch(getRecurring());
        dispatch(getDebts());
    }, [dispatch]);

    useEffect(() => {
        if (user?.user) {
            setFormData(prev => {
                if (prev.name === user.user.name && prev.email === user.user.email && prev.currency === user.user.currency) return prev;
                return {
                    name: user.user.name,
                    email: user.user.email,
                    currency: user.user.currency || 'INR',
                };
            });
        }
    }, [user]);

    useEffect(() => {
        if (budgets.length > 0) {
            const budgetMap = {};
            budgets.forEach(b => {
                budgetMap[b.category] = b.amount;
            });
            setBudgetData(prev => {
                const isSame = JSON.stringify(prev) === JSON.stringify(budgetMap);
                return isSame ? prev : budgetMap;
            });
        }
    }, [budgets]);

    useEffect(() => {
        if (authSuccess && !authLoading) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
                dispatch(reset());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [authSuccess, authLoading, dispatch]);

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
    };

    const handleBudgetSave = (category) => {
        const amount = budgetData[category];
        if (amount) {
            dispatch(upsertBudget({ category, amount }));
        }
    };

    return (
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold neon-text text-primary">Settings</h2>
                    <p className="text-gray-400">Manage your account preferences and profile.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <SettingsIcon size={24} className="text-primary" />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'profile' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <User size={18} />
                        Account Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('budgets')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'budgets' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <Target size={18} />
                        Monthly Budgets
                    </button>
                    <button
                        onClick={() => setActiveTab('recurring')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'recurring' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <CalendarRange size={18} />
                        Subscriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('debts')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'debts' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <TrendingDownIcon size={18} />
                        Debt Management
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'notifications' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all font-medium ${activeTab === 'security' ? 'bg-primary/10 text-primary border-primary/20' : 'text-gray-400 hover:bg-white/5 border-transparent'
                            }`}
                    >
                        <Shield size={18} />
                        Security & Privacy
                    </button>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.form
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleProfileSubmit}
                                className="glass p-8 border-white/10 space-y-8"
                            >
                                <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold border border-primary/20">
                                        {formData.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{formData.name}</h3>
                                        <p className="text-sm text-gray-400">Chennai, India</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <User size={14} /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="Your Name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Mail size={14} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <IndianRupee size={14} /> Base Currency
                                        </label>
                                        <select
                                            value={formData.currency || 'INR'}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-colors text-white"
                                        >
                                            <option value="INR">INR (₹) - Indian Rupee</option>
                                            <option value="USD">USD ($) - US Dollar</option>
                                            <option value="EUR">EUR (€) - Euro</option>
                                            <option value="GBP">GBP (£) - British Pound</option>
                                            <option value="JPY">JPY (¥) - Japanese Yen</option>
                                        </select>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {(authError || showSuccess) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`flex items-center gap-2 p-4 rounded-xl text-sm ${showSuccess ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}
                                        >
                                            {showSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            {showSuccess ? 'Profile updated successfully!' : authMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={authLoading}
                                        className="bg-primary text-black font-bold px-8 py-3 rounded-xl flex items-center gap-2 shadow-neon-blue hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        {authLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Changes'}
                                    </button>
                                </div>
                            </motion.form>
                        ) : activeTab === 'budgets' ? (
                            <motion.div
                                key="budgets"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 border-white/10 space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Monthly Spending Limits</h3>
                                    <p className="text-sm text-gray-400">Set maximum spending limits for each category to stay on track.</p>
                                </div>

                                <div className="space-y-4">
                                    {categories.map(category => (
                                        <div key={category} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500 block mb-1">{category}</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary font-bold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={budgetData[category] || ''}
                                                        onChange={(e) => setBudgetData({ ...budgetData, [category]: e.target.value })}
                                                        className="bg-transparent border-none focus:outline-none w-full text-lg"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleBudgetSave(category)}
                                                className="p-3 hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors rounded-lg"
                                            >
                                                <Save size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : activeTab === 'recurring' ? (
                            <motion.div
                                key="recurring"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 border-white/10"
                            >
                                <RecurringList recurring={recurring} />
                            </motion.div>
                        ) : activeTab === 'debts' ? (
                            <motion.div
                                key="debts"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 border-white/10"
                            >
                                <DebtTracker debts={debts} />
                            </motion.div>
                        ) : activeTab === 'notifications' ? (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 border-white/10 space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-primary">Notification Settings</h3>
                                    <p className="text-sm text-gray-400">Control how you receive alerts and updates.</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { id: 'push', title: 'Push Notifications', desc: 'Receive alerts on your device for spending limits.' },
                                        { id: 'email_reports', title: 'Email Weekly Reports', desc: 'Get a summary of your weekly financial health.' },
                                        { id: 'smart_tips', title: 'Smart Financial Tips', desc: 'AI-generated suggestions based on your habits.' }
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div>
                                                <h4 className="font-medium">{item.title}</h4>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                            <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer opacity-50">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-primary rounded-full transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : activeTab === 'security' ? (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="glass p-8 border-white/10 space-y-6"
                            >
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-primary">Security & Privacy</h3>
                                    <p className="text-sm text-gray-400">Manage your account security and data privacy.</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                                        <h4 className="font-medium flex items-center gap-2"><Shield size={16} className="text-primary" /> Multi-Factor Authentication</h4>
                                        <p className="text-xs text-gray-400">Add an extra layer of security to your account. (Coming Soon)</p>
                                        <button className="text-xs font-bold text-primary opacity-50 cursor-not-allowed">Enable MFA</button>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                                        <h4 className="font-medium flex items-center gap-2"><Mail size={16} className="text-primary" /> Session Management</h4>
                                        <p className="text-xs text-gray-400">View and manage your active sessions across devices.</p>
                                        <button className="text-xs font-bold text-primary">View Sessions</button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    <div className="glass p-6 border-white/5 bg-red-500/5">
                        <h4 className="text-red-500 font-bold mb-2">Danger Zone</h4>
                        <p className="text-sm text-gray-400 mb-4 text-pretty">Deleting your account is permanent and cannot be undone. All your transaction history will be lost.</p>
                        <button className="px-4 py-2 border border-red-500/30 text-red-500 rounded-lg text-sm hover:bg-red-500 hover:text-white transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
