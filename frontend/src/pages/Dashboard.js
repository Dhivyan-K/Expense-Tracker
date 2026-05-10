import { useState, useEffect } from 'react';
import { transactionAPI } from '../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { MdTrendingUp, MdTrendingDown, MdAccountBalance, MdCalendarMonth } from 'react-icons/md';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const StatCard = ({ title, amount, icon: Icon, color, bg }) => (
  <div className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 ${color} bg-white rounded-xl flex items-center justify-center shadow-sm`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-xl font-bold text-gray-800">₹{amount?.toLocaleString('en-IN') || '0'}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await transactionAPI.getSummary();
      setSummary(res.data.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const doughnutData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [summary?.totalIncome || 0, summary?.totalExpense || 0],
      backgroundColor: ['#22c55e', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  const barData = {
    labels: ['Total Income', 'Total Expense', 'Balance'],
    datasets: [{
      label: 'Amount (₹)',
      data: [summary?.totalIncome || 0, summary?.totalExpense || 0, summary?.balance || 0],
      backgroundColor: ['#22c55e80', '#ef444480', '#3b82f680'],
      borderColor: ['#22c55e', '#ef4444', '#3b82f6'],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const typeColors = { income: 'text-green-500 bg-green-50', expense: 'text-red-500 bg-red-50' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Your financial overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Balance" amount={summary?.balance} icon={MdAccountBalance} color="text-blue-500" bg="bg-blue-50" />
        <StatCard title="Total Income" amount={summary?.totalIncome} icon={MdTrendingUp} color="text-green-500" bg="bg-green-50" />
        <StatCard title="Total Expense" amount={summary?.totalExpense} icon={MdTrendingDown} color="text-red-500" bg="bg-red-50" />
        <StatCard title="Monthly Expense" amount={summary?.monthlyExpense} icon={MdCalendarMonth} color="text-orange-500" bg="bg-orange-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expense</h2>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Financial Summary</h2>
          <div className="h-56">
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h2>
        {summary?.recentTransactions?.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet. Add your first one!</p>
        ) : (
          <div className="space-y-3">
            {summary?.recentTransactions?.map(t => (
              <div key={t._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${typeColors[t.type]}`}>
                    {t.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
