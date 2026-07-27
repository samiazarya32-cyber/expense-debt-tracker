import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { supabase } from '@simple-cash/api-client';
import InstallPrompt from '../components/InstallPrompt';
import ReportHistorySidebar from '../components/ReportHistorySidebar';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReportData {
  period: string; // e.g., "2024-07-27"
  income: number;
  expense: number;
  net: number;
}

export default function Dashboard() {
  const [daily, setDaily] = useState<ReportData | null>(null);
  const [weekly, setWeekly] = useState<ReportData | null>(null);
  const [monthly, setMonthly] = useState<ReportData | null>(null);

  // fetch latest aggregates from Supabase (or local IndexedDB fallback)
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) console.error('Failed to load reports', error);
      if (data) {
        // assuming first = daily, second = weekly, third = monthly (based on type column)
        const dailyReport = data.find((r: any) => r.type === 'daily');
        const weeklyReport = data.find((r: any) => r.type === 'weekly');
        const monthlyReport = data.find((r: any) => r.type === 'monthly');
        setDaily(dailyReport);
        setWeekly(weeklyReport);
        setMonthly(monthlyReport);
      }
    }
    load();
  }, []);

  const chartData = (report: ReportData | null) => ({
    labels: ['Income', 'Expense', 'Net'],
    datasets: [
      {
        label: report?.period ?? '...',
        data: report ? [report.income, report.expense, report.net] : [0, 0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // emerald (income)
          'rgba(239, 68, 68, 0.7)', // red (expense)
          'rgba(59, 130, 246, 0.7)', // blue (net)
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <ReportHistorySidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Simple Cash Dashboard
        </h1>
        <InstallPrompt />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-filter backdrop-blur-md">
            <h2 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Daily</h2>
            <Bar data={chartData(daily)} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-filter backdrop-blur-md">
            <h2 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Weekly</h2>
            <Bar data={chartData(weekly)} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-filter backdrop-blur-md">
            <h2 className="text-xl font-medium mb-2 text-gray-700 dark:text-gray-300">Monthly</h2>
            <Bar data={chartData(monthly)} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </section>
        {/* Quick action FABs */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4">
          <button className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition">
            +E
          </button>
          <button className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition">
            +I
          </button>
          <button className="w-14 h-14 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 transition">
            +D
          </button>
        </div>
      </main>
    </div>
  );
}

// Server‑side can pre‑fetch if you want – for now we keep it client‑side only.
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
