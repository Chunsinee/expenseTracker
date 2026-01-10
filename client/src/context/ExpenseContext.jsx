import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const [expRes, catRes] = await Promise.all([
        api.get("/expenses"),
        api.get("/categories"),
      ]);

      const categoryMap = Object.fromEntries(
        catRes.data.map((cat) => [cat.id, cat.name])
      );

      const formattedExpenses = expRes.data.map((e) => ({
        ...e,
        category: categoryMap[e.category_id] || "Uncategorized",
        title: e.note || "",
      }));

      setExpenses(formattedExpenses);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addExpense = async (expense) => {
    try {
      let categoryId;
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === expense.category.toLowerCase()
      );

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const res = await api.post("/categories", { name: expense.category });
        setCategories([...categories, res.data]);
        categoryId = res.data.id;
      }

      await api.post("/expenses", {
        category_id: categoryId,
        amount: expense.amount,
        date: expense.date,
        note: expense.title,
      });

      fetchData();
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Error adding expense. Please try again.");
    }
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, categories, addExpense, fetchExpenses: fetchData }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
