import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions, deleteTransaction } from '../store/transactionSlice';
import { getBudgets } from '../store/budgetSlice';
import { getRecurring } from '../store/recurringSlice';
import { getDebts } from '../store/debtSlice';
import SummaryCard from '../components/SummaryCard';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import BudgetProgress from '../components/BudgetProgress';
import AddTransactionModal from '../components/AddTransactionModal';
import {
    IndianRupee, TrendingUp, TrendingDown as TrendingDownIcon,
    Plus, Target, CreditCard, Wallet, ChevronRight,
    Percent, Calendar, Sparkles, TrendingDown
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatCurrency } from '../utils/currencyUtils';
import CategoryDonut from '../components/CategoryDonut';
import HealthScore from '../components/HealthScore';

const categoryColors = {
    'Food': '#f59e0b',
    'Rent': '#10b981',
    'Transport': '#3b82f6',
    'Entertainment': '#ec4899',
    'Shopping': '#8b5cf6',
    'Health': '#ef4444',
    'Other': '#6b7280',
};

const Dashboard = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { transactions } = useSelector((state) => state.transactions);
    const { budgets } = useSelector((state) => state.budgets);
    const { recurring } = useSelector((state) => state.recurring);
    const { debts } = useSelector((state) => state.debts);
    const { currency } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getTransactions());
        dispatch(getBudgets());
        dispatch(getRecurring());
        dispatch(getDebts());
    }, [dispatch]);

    // Filter upcoming active bills in next 7 days
    const upcomingPayments = recurring
        .filter(r => r.is_active)
        .filter(r => {
            const nextDate = new Date(r.next_date);
            const today = new Date();
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(today.getDate() + 7);
            return nextDate >= today && nextDate <= sevenDaysLater;
        })
        .sort((a, b) => new Date(a.next_date) - new Date(b.next_date));

    const income = transactions
        .filter((t) => parseFloat(t.amount) > 0)
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const expenses = transactions
        .filter((t) => parseFloat(t.amount) < 0)
        .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;

    const totalDebt = debts.reduce((acc, d) => acc + d.remaining_amount, 0);
    const dtiRatio = income > 0 ? (debts.reduce((acc, d) => acc + d.emi_amount, 0) / income) * 100 : 0;

    const upcomingEMIs = debts
        .filter(d => {
            const nextDate = new Date(d.next_emi_date);
            const today = new Date();
            const fifteenDaysLater = new Date();
            fifteenDaysLater.setDate(today.getDate() + 15);
            return nextDate >= today && nextDate <= fifteenDaysLater;
        })
        .sort((a, b) => new Date(a.next_emi_date) - new Date(b.next_emi_date));

    // Calculate spent per category for current month
    const categorySpent = transactions
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(parseFloat(t.amount));
            return acc;
        }, {});

    // --- Advanced Calculations ---

    // 1. Total Monthly Subscriptions
    const monthlySubscriptionTotal = recurring
        .filter(r => r.is_active)
        .reduce((acc, r) => {
            // Normalize to monthly
            let amount = parseFloat(r.amount);
            if (r.frequency === 'weekly') amount *= 4;
            if (r.frequency === 'yearly') amount /= 12;
            return acc + amount;
        }, 0);

    // 2. Debt Progress (%)
    const totalPrincipal = debts.reduce((acc, d) => acc + d.total_amount, 0);
    const debtClearedPercent = totalPrincipal > 0
        ? ((totalPrincipal - totalDebt) / totalPrincipal) * 100
        : 0;

    // 3. Financial Health Score (0-100)
    const calculateHealthScore = () => {
        let score = 0;

        // Savings Rate (Max 40 points) - Aiming for 20% savings
        const rate = parseFloat(savingsRate);
        score += Math.min(Math.max(0, (rate / 20) * 40), 40);

        // DTI Ratio (Max 30 points) - Healthy is < 30%
        if (dtiRatio <= 30) score += 30;
        else if (dtiRatio < 50) score += 15;

        // Budget Adherence (Max 30 points)
        const budgetCategories = budgets.length;
        if (budgetCategories > 0) {
            const adhered = budgets.filter(b => (categorySpent[b.category] || 0) <= b.amount).length;
            score += (adhered / budgetCategories) * 30;
        } else {
            score += 15; // Default if no budgets set
        }

        return Math.min(score, 100);
    };

    const healthScore = calculateHealthScore();

    // 4. Smart Insights
    const getInsight = () => {
        if (savingsRate > 20) return { text: "Peak Performance! Your savings rate is excellent.", icon: Sparkles, color: "#10b981" };
        if (dtiRatio > 40) return { text: "High Leverage: Your debt obligations are significant.", icon: TrendingDown, color: "#ef4444" };
        if (budgets.some(b => (categorySpent[b.category] || 0) > b.amount)) return { text: "Budget Alert: You've exceeded limits in some categories.", icon: Target, color: "#f59e0b" };
        return { text: "Steady progress. Consistency is key to wealth building.", icon: TrendingUp, color: "#3b82f6" };
    };

    const insight = getInsight();

    // 5. Chart Data Logic (Restored)
    const chartDataMap = transactions.reduce((acc, t) => {
        const date = new Date(t.created_at || 0);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };

        const amount = parseFloat(t.amount);
        if (amount > 0) {
            acc[month].income += amount;
        } else {
            acc[month].expense += Math.abs(amount);
        }
        return acc;
    }, {});

    const chartData = Object.values(chartDataMap).slice(-6);

    const handleDelete = (id) => {
        dispatch(deleteTransaction(id));
    };

    return (
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold neon-text">Financial Overview</h2>
                    <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-neon-blue"
                >
                    <Plus size={20} />
                    New Transaction
                </motion.button>
            </header>

            <div className="flex flex-wrap gap-6">
                <SummaryCard
                    title="Total Balance"
                    amount={balance}
                    icon={IndianRupee}
                    color="#00f2ff"
                />
                <SummaryCard
                    title="Total Income"
                    amount={income}
                    icon={TrendingUp}
                    color="#10b981"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={expenses}
                    icon={TrendingDownIcon}
                    color="#ef4444"
                />
                {totalDebt > 0 && (
                    <SummaryCard
                        title="Outstanding Debt"
                        amount={totalDebt}
                        icon={Wallet}
                        color="#f59e0b"
                    />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <SpendingChart data={chartData} />

                    {/* Budgets & Health Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-6 border-white/5 relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Sparkles size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Financial Health</h3>
                            </div>
                            <HealthScore score={healthScore} />

                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                                <insight.icon size={18} style={{ color: insight.color }} />
                                <p className="text-xs text-gray-300 italic">{insight.text}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-6 border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Spend Analysis</h3>
                            </div>
                            <CategoryDonut data={categorySpent} colors={categoryColors} />

                            <div className="mt-6 space-y-3">
                                {Object.entries(categorySpent).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat, amt]) => (
                                    <div key={cat} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[cat] }} />
                                            <span className="text-[11px] text-gray-400 font-medium">{cat}</span>
                                        </div>
                                        <span className="text-[11px] font-bold">{formatCurrency(amt, currency)}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {budgets.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-6 border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Target size={20} />
                                </div>
                                <h3 className="text-lg font-bold">Monthly Budgets</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {budgets.map(budget => (
                                    <BudgetProgress
                                        key={budget.id}
                                        category={budget.category}
                                        budgeted={budget.amount}
                                        spent={categorySpent[budget.category] || 0}
                                        color={categoryColors[budget.category] || '#6b7280'}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
                <div>
                    <div className="space-y-8">
                        {/* Upcoming Payments Widget */}
                        {upcomingPayments.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 border-white/5"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                            <CreditCard size={18} />
                                        </div>
                                        <h3 className="font-bold">Upcoming Bills</h3>
                                    </div>
                                    <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full font-bold">NEXT 7 DAYS</span>
                                </div>
                                <div className="space-y-4">
                                    {upcomingPayments.map(bill => (
                                        <div key={bill.id} className="flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-purple-500/20 rounded-full" />
                                                <div>
                                                    <p className="text-sm font-medium">{bill.text}</p>
                                                    <p className="text-[10px] text-gray-500">{new Date(bill.next_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold">{formatCurrency(bill.amount, currency)}</p>
                                                <ChevronRight size={14} className="text-gray-600 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* EMI Reminders Widget */}
                        {upcomingEMIs.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="glass p-6 border-orange-500/10 bg-orange-500/5 shadow-neon-orange/10"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                            <Calendar size={18} />
                                        </div>
                                        <h3 className="font-bold">Next EMIs</h3>
                                    </div>
                                    <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full font-bold">REPLY SOON</span>
                                </div>
                                <div className="space-y-4">
                                    {upcomingEMIs.map(emi => (
                                        <div key={emi.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-orange-500/20 rounded-full" />
                                                <div>
                                                    <p className="text-sm font-medium">{emi.name}</p>
                                                    <p className="text-[10px] text-gray-500">{new Date(emi.next_emi_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-orange-500">{formatCurrency(emi.emi_amount, currency)}</p>
                                                <p className="text-[9px] text-gray-500 uppercase">{emi.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Debt-to-Income Health Badge */}
                        {totalDebt > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-6 border-white/5 space-y-6"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <Percent size={18} />
                                        </div>
                                        <h4 className="text-sm font-bold">Financial Standing</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {/* DTI Ratio */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                                                <span className="text-gray-500">DTI Ratio</span>
                                                <span className={dtiRatio > 40 ? 'text-red-500' : 'text-primary'}>
                                                    {dtiRatio.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${dtiRatio > 40 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]'}`}
                                                    style={{ width: `${Math.min(dtiRatio, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Debt Payoff Progress */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                                                <span className="text-gray-500">Debt Paid Off</span>
                                                <span className="text-green-500">{debtClearedPercent.toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                    style={{ width: `${debtClearedPercent}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Subscription Load */}
                                        <div className="pt-2 border-t border-white/5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">Monthly Subscriptions</span>
                                                <span className="text-sm font-bold text-purple-500">{formatCurrency(monthlySubscriptionTotal, currency)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <TransactionList
                            transactions={transactions.slice(0, 5)}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
