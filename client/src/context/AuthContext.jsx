import {
  createContext, // สร้าง Context สำหรับแชร์ข้อมูล (เช่น user info) ไปยังทุก Component
  useContext, // Hook สำหรับดึงข้อมูลจาก Context มาใช้งาน
  useState,
} from "react";

const AuthContext = createContext();

// Provider for authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        return JSON.parse(userData); // ส่งค่า user -> obj ให้เอาค่าไปใช้ต่อได้
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    return null; // user เป็น null
  });

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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// Hook สำหรับดึงข้อมูลจาก Context
export const useAuth = () => useContext(AuthContext);
