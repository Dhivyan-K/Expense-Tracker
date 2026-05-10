import { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const TABS = ['Weekly', 'Monthly', 'Categories'];
const COLORS = ['#22c55e','#ef4444','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#10b981','#84cc16','#06b6d4'];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('Weekly');
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [catType, setCatType] = useState('expense');

  useEffect(() => {
    if (activeTab === 'Weekly') fetchWeekly();
    if (activeTab === 'Monthly') fetchMonthly();
    if (activeTab === 'Categories') fetchCategories();
  }, [activeTab, year, catType]);

  const fetchWeekly = async () => {
    setLoading(true);
    try {
      const res = await reportAPI.weekly();
      setWeeklyData(res.data.data);
    } catch { toast.error('Failed to load weekly data'); }
    finally { setLoading(false); }
  };

  const fetchMonthly = async () => {
    setLoading(true);
    try {
      const res = await reportAPI.monthly({ year });
      setMonthlyData(res.data.data);
    } catch { toast.error('Failed to load monthly data'); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await reportAPI.categories({ type: catType });
      setCategoryData(res.data.data);
    } catch { toast.error('Failed to load category data'); }
    finally { setLoading(false); }
  };

  const weeklyChart = {
    labels: weeklyData.map(d => d.day),
    datasets: [
      { label: 'Income', data: weeklyData.map(d => d.income), backgroundColor: '#22c55e80', borderColor: '#22c55e', borderWidth: 2, borderRadius: 6 },
      { label: 'Expense', data: weeklyData.map(d => d.expense), backgroundColor: '#ef444480', borderColor: '#ef4444', borderWidth: 2, borderRadius: 6 }
    ]
  };

  const monthlyChart = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      { label: 'Income', data: monthlyData.map(d => d.income), borderColor: '#22c55e', backgroundColor: '#22c55e20', tension: 0.4, fill: true },
      { label: 'Expense', data: monthlyData.map(d => d.expense), borderColor: '#ef4444', backgroundColor: '#ef444420', tension: 0.4, fill: true },
      { label: 'Savings', data: monthlyData.map(d => d.savings), borderColor: '#3b82f6', backgroundColor: '#3b82f620', tension: 0.4, fill: true },
    ]
  };

  const incomeCategories = categoryData.filter(d => d._id.type === 'income');
  const expenseCategories = categoryData.filter(d => d._id.type === 'expense');
  const displayCategories = catType === 'income' ? incomeCategories : expenseCategories;

  const categoryChart = {
    labels: displayCategories.map(d => d._id.category),
    datasets: [{
      data: displayCategories.map(d => d.total),
      backgroundColor: COLORS.slice(0, displayCategories.length),
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  const chartOptions = { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">Visualize your financial patterns</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'Weekly' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">This Week's Overview</h2>
              <div className="h-72">
                <Bar data={weeklyChart} options={chartOptions} />
              </div>

              {/* Weekly Summary Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    {['Day', 'Income', 'Expense', 'Net'].map(h =>
                      <th key={h} className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {weeklyData.map(d => (
                      <tr key={d.day} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-gray-800">{d.day}</td>
                        <td className="py-2.5 px-3 text-green-600">₹{d.income.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-red-500">₹{d.expense.toLocaleString('en-IN')}</td>
                        <td className={`py-2.5 px-3 font-semibold ${d.income - d.expense >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                          ₹{(d.income - d.expense).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Monthly' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Year:</label>
                <select value={year} onChange={e => setYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                  {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Trends ({year})</h2>
                <div className="h-72">
                  <Line data={monthlyChart} options={chartOptions} />
                </div>
              </div>

              {/* Monthly Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    {['Month', 'Income', 'Expense', 'Savings'].map(h =>
                      <th key={h} className="py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {monthlyData.map(d => (
                      <tr key={d.month} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{d.month}</td>
                        <td className="py-3 px-4 text-green-600">₹{d.income.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-red-500">₹{d.expense.toLocaleString('en-IN')}</td>
                        <td className={`py-3 px-4 font-semibold ${d.savings >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
                          ₹{d.savings.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Categories' && (
            <div className="space-y-5">
              <div className="flex gap-2">
                {['expense', 'income'].map(t => (
                  <button key={t} onClick={() => setCatType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
                      ${catType === t
                        ? t === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4 capitalize">{catType} by Category</h2>
                  <div className="h-64">
                    {displayCategories.length > 0
                      ? <Doughnut data={categoryChart} options={chartOptions} />
                      : <p className="text-center text-gray-400 pt-20">No {catType} data available</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Breakdown</h2>
                  <div className="space-y-3">
                    {displayCategories.map((d, i) => {
                      const total = displayCategories.reduce((s, x) => s + x.total, 0);
                      const pct = total > 0 ? ((d.total / total) * 100).toFixed(1) : 0;
                      return (
                        <div key={d._id.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{d._id.category}</span>
                            <span className="text-gray-500">₹{d.total.toLocaleString('en-IN')} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    {displayCategories.length === 0 && <p className="text-center text-gray-400 py-8">No data available</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
