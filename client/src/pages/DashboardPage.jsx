import { useState, useMemo } from "react";
import { Wallet, Utensils, Car, CreditCard, ChevronDown } from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ExpenseChart } from "../components/dashboard/ExpenseChart";
import { useExpenses } from "../context/ExpenseContext";
import { Button, Card } from "../components/ui";

const toNumber = (value) => Number(value) || 0;

const CATEGORY_CONFIG = {
  food: {
    icon: Utensils,
    color: "text-blue-500 bg-blue-50",
    chartColor: "#3b82f6",
  },
  transport: {
    icon: Car,
    color: "text-purple-500 bg-purple-50",
    chartColor: "#a855f7",
  },
  "credit card": {
    icon: CreditCard,
    color: "text-emerald-500 bg-emerald-50",
    chartColor: "#10b981",
  },
  default: {
    icon: Wallet,
    color: "text-gray-500 bg-gray-50",
    chartColor: "#9ca3af",
  },
};

const getCategoryConfig = (category) => {
  const normalized = (category || "").toLowerCase();
  return CATEGORY_CONFIG[normalized] || CATEGORY_CONFIG.default;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DashboardPage = () => {
  const { expenses } = useExpenses();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11

  // Max last 5 years
  const yearOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  }, [currentYear]);

  // Filter expenses by month and year
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!e.date) return false;
      const date = new Date(e.date);
      return (
        date.getFullYear() === Number(selectedYear) &&
        date.getMonth() === Number(selectedMonth)
      );
    });
  }, [expenses, selectedYear, selectedMonth]);

  // Category Stats
  const categoryStats = useMemo(() => {
    return filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + toNumber(e.amount);
      return acc;
    }, {});
  }, [filteredExpenses]);

  // Total Expense
  const totalExpense = useMemo(() => {
    return Object.values(categoryStats).reduce((sum, value) => sum + value, 0);
  }, [categoryStats]);

  // Top Category
  const topCategory = useMemo(() => {
    let maxName = "None";
    let maxValue = 0;

    Object.entries(categoryStats).forEach(([name, value]) => {
      if (value > maxValue) {
        maxValue = value;
        maxName = name;
      }
    });

    return { name: maxName, value: maxValue };
  }, [categoryStats]);

  // Chart Data
  const chartData = useMemo(() => {
    return Object.entries(categoryStats).map(([name, value]) => ({
      name,
      value,
      color: getCategoryConfig(name).chartColor,
    }));
  }, [categoryStats]);

  const topCategoryPercent =
    totalExpense > 0 ? Math.round((topCategory.value / totalExpense) * 100) : 0;

  const TopCategoryIcon = getCategoryConfig(topCategory.name).icon;

  // Recent Expenses
  const recentExpenses = useMemo(() => {
    return [...filteredExpenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [filteredExpenses]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Spending Card */}
              <Card className="relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full min-h-[100px]">
                  <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">
                    Total Spending ( Monthly )
                  </p>
                  <div className="flex-1 flex items-center">
                    <h2 className="text-4xl font-bold text-gray-900">
                      ฿{totalExpense.toLocaleString()}
                    </h2>
                  </div>
                </div>
              </Card>

              {/* Top Category Card */}
              <Card>
                <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider">
                  Top Spending Category
                </p>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <TopCategoryIcon size={32} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {topCategory.name}
                    </h3>
                    <p className="text-gray-500 text-base">
                      ฿{topCategory.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Expenses Table */}
            <Card>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Expenses
                </h3>

                <div className="flex items-center gap-2">
                  {/* Year Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-700 font-medium text-sm py-2 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Month Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-700 font-medium text-sm py-2 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                    >
                      {MONTH_NAMES.map((name, index) => (
                        <option key={index} value={index}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 font-medium pl-4">Date</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Category</th>
                      <th className="pb-4 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentExpenses.length > 0 ? (
                      recentExpenses.map((expense) => {
                        return (
                          <tr
                            key={expense.id}
                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 pl-4 text-gray-500">
                              {new Date(expense.date).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="py-4 font-bold text-gray-900">
                              ฿{expense.amount.toLocaleString()}
                            </td>
                            <td className="py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  getCategoryConfig(expense.category).color
                                }`}
                              >
                                {expense.category}
                              </span>
                            </td>
                            <td className="py-4 text-gray-500">
                              {expense.title}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-8 text-center text-gray-400"
                        >
                          No expenses found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Expense Distribution */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Expense Distribution
              </h3>

              <div className="mb-6">
                <ExpenseChart
                  data={chartData}
                  centerLabel={topCategory.name}
                  centerValue={`${topCategoryPercent}%`}
                />
              </div>

              <div className="space-y-4">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-500 text-sm font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-900 font-bold text-sm">
                      ฿{item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
