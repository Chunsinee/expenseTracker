import {
  createContext, // สร้าง Context สำหรับแชร์ข้อมูล (เช่น user info) ไปยังทุก Component
  useContext, // Hook สำหรับดึงข้อมูลจาก Context มาใช้งาน
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();

// Provider for authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ดูใน Local Storage ของ Browser ว่ามี token กับ user เก็บไว้ไหม
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData)); // แปลงข้อมูล user จาก JSON string กลับเป็น Object
      } catch {
        localStorage.removeItem("user"); // ถ้าแปลงไม่ได้ ให้ลบข้อมูลทิ้ง
      }
    }
  }, []); // <--- วงเล็บว่าง = ทำครั้งเดียวตอน component โหลดเสร็จ

  const login = (token, userData) => {
    localStorage.setItem("token", token); // เก็บ token
    localStorage.setItem("user", JSON.stringify(userData)); // เก็บ user
    setUser(userData); // อัปเดต state
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    // ส่ง user, login, logout ผ่าน AuthContext ให้ลูกหลาน (children) ใช้
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// Hook สำหรับดึงข้อมูลจาก Context
export const useAuth = () => useContext(AuthContext);
