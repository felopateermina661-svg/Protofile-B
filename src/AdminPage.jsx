import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const [user, setUser] = useState(undefined); // undefined = بنتحقق لسه

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
        <p className="text-white/50 text-[14px]">جاري التحقق...</p>
      </div>
    );
  }

  return user ? <AdminPanel /> : <AdminLogin onSuccess={() => {}} />;
}
