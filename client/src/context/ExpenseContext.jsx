import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const { user } = useAuth();

  /* 
  // OLD: เปรียบเทียบกับ logic ใหม่
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // ... แก้  ...
    }
    // ...
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  */

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      // OLD: if (!token) return; แก้ให้ set state ใหม่เผื่กรณีที่ข้อมูลเก่าจะค้างใน memo
      // NEW: Clear data if token is missing
      if (!token) {
        setExpenses([]);
        setCategories([]);
        return;
      }

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

  /* 
  // OLD: ทำงานตอนเปิดเว็บครั้งแรก ซึ่งจะไม่ทำงานซ้ำแล้วทำให้ Login โหลดนานเพราะต้องสั่ง await fetchExpenses() เองก่อนให้โหลดข้อมูลแล้วค่อยเข้า
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  */

  // NEW: ทำงานเมื่อ user เปลี่ยน ไม่ได้ให้หน้าล็อคอินโหลดเอง จะโหลดทุกครั้งที่ user เปลี่ยน
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setExpenses([]);
      setCategories([]);
    }
  }, [user, fetchData]);

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
//ฟังชันดึงข้อมูลรายจ่าย
export const useExpenses = () => useContext(ExpenseContext);
