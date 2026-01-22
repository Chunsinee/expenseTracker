import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback, // ใช้ useCallback เพื่อจำฟังก์ชันไม่ให้สร้างใหม่ทุกครั้งที่ component re-render
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext"; // ดึง useAuth เพื่อเช็ค user

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
      // Ensure async execution to prevent synchronous setState in useEffect
      await Promise.resolve();
      const token = localStorage.getItem("token");

      if (!token) {
        setExpenses([]);
        setCategories([]);
        return;
      }

      const [expRes, catRes] = await Promise.all([
        // Promise.all สั่งให้ดึง API 2 ตัวพร้อมกัน
        api.get("/expenses"),
        api.get("/categories"),
        // คำสั่ง sql จากไฟล expenseController.js
        // expRes.data = ข้อมูลดิบ Array [ { id: 1, amount: 100, note: 'Food' }, ... ]
        // catRes.data = ข้อมูลดิบ Array [ { id: 1, name: 'Food' }, ... ]
      ]);

      // เปลี่ยน listArray ให้กลายเป็น Object Lookup ใช้ง่ายขึ้นใน function categoryStats
      const categoryMap = Object.fromEntries(
        // แปลงกลับเป็น Object --> { 1: 'Food', 2: 'Transport', ... }
        catRes.data.map((cat) => [cat.id, cat.name]),
        // .map แปลง data ให้เป็น Key-Value Pair -> [1, 'Food']
      );

      const formattedExpenses = expRes.data.map((e) => ({
        ...e,
        // ใช้ categoryMap เพื่อแปลง category_id เป็น category name
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
      // ถ้า user หายไป (Logout)
      setExpenses([]);
      setCategories([]);
    }
  }, [user, fetchData]);

  // รับค่า 'expense' (ข้อมูลรายจ่ายที่ user กรอกมา) เข้ามาทำงาน
  const addExpense = async (expense) => {
    try {
      let categoryId;
      // เช็คว่ามี category นี้ใน database ยัง
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === expense.category.toLowerCase(),
      );

      if (existingCategory) {
        categoryId = existingCategory.id; // ถ้ามี category -> ใช้ id เดิม
      } else {
        // ถ้าไม่มี category -> สร้างใหม่
        const res = await api.post("/categories", { name: expense.category });
        setCategories([...categories, res.data]);
        categoryId = res.data.id;
      }

      // เก็บข้อมูล expense ลง database
      await api.post("/expenses", {
        category_id: categoryId,
        amount: expense.amount,
        date: expense.date,
        note: expense.title,
      });

      fetchData(); // เรียกใช้ fetchData เพื่ออัปเดตข้อมูลใหม่ล่าสุด
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Error adding expense. Please try again.");
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        fetchExpenses: fetchData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
//ฟังชันดึงข้อมูลรายจ่าย
export const useExpenses = () => useContext(ExpenseContext);
