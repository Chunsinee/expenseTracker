import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button, Card } from "../components/ui";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const AddExpensePage = () => {
  const navigate = useNavigate();
  const { addExpense, categories } = useExpenses();

  // Form State
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize category
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategory(newCategoryName);
      setNewCategoryName("");
      setIsAddingCategory(false);
    }
  };

  const handleSave = () => {
    if (!amount) return;

    addExpense({
      title: note || category,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
    });

    navigate("/dashboard");
  };

  // Calendar Logic
  const currentMonth = new Date(date).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    new Date(date).getFullYear(),
    new Date(date).getMonth(),
    1
  ).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <DashboardLayout title="Add expense">
      <div className="max-w-5xl mx-auto pt-0 pb-6">
        {/* Main Wrapper Card */}
        <Card className="p-8 shadow-xl">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Top Section - Expense Info and Date in 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Expense Title & Amount (Dark Card) */}
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Expense Title */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Expense Title
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Expense"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        ฿
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right: Date Picker & Calendar */}
              <Card className="p-6">
                <div className="space-y-4">
                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                      />
                      <CalendarIcon
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Calendar Widget */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {currentMonth}
                      </h3>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 cursor-pointer">
                          <ChevronLeft size={18} />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 cursor-pointer">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {WEEK_DAYS.map((d, i) => (
                        <div
                          key={i}
                          className="text-center text-xs font-medium text-gray-400"
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 place-items-center">
                      {calendarDays.map((d, i) => {
                        if (d === null)
                          return <div key={i} className="w-8 h-8" />;
                        const isSelected = d === new Date(date).getDate();
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              const newDate = new Date(date);
                              newDate.setDate(d);
                              setDate(newDate.toISOString().split("T")[0]);
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Bottom Section - Category */}
            <Card className="p-6">
              <div className="space-y-4">
                <label className="block text-lg font-bold text-gray-900 mb-2">
                  Expense Category
                </label>

                <div className="flex flex-wrap gap-3">
                  {/* Add Button */}
                  {isAddingCategory ? (
                    <div className="flex items-center gap-2 h-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 animate-in fade-in zoom-in duration-200">
                      <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddCategory()
                        }
                        placeholder="New..."
                        className="w-20 text-sm outline-none bg-transparent"
                        autoFocus
                      />
                      <button
                        onClick={handleAddCategory}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingCategory(true)}
                      className="w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all hover:bg-blue-50 cursor-pointer"
                    >
                      <Plus size={24} />
                    </button>
                  )}

                  {/* Category Chips */}
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.name)}
                      className={`h-12 px-6 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
                        category === cat.name
                          ? "bg-blue-600 text-white shadow-blue-500/30 scale-105"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}

                  {/* Show temporary new category if selected but not in list yet */}
                  {category && !categories.some((c) => c.name === category) && (
                    <button
                      onClick={() => {}}
                      className="h-12 px-6 rounded-xl font-medium text-sm transition-all shadow-sm bg-blue-600 text-white shadow-blue-500/30 scale-105"
                    >
                      {category}
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              className="w-full h-14 bg-[#0eb31c] hover:bg-[#0c9616] text-white rounded-2xl text-lg font-semibold shadow-xl shadow-green-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Save Expense
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
