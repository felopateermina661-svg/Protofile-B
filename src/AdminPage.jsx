import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const [session, setSession] = useState(undefined); // undefined = بنتحقق لسه

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#07070A] flex items-center justify-center">
        <p className="text-white/50 text-[14px]">جاري التحقق...</p>
      </div>
    );
  }

  return session ? <AdminPanel /> : <AdminLogin onSuccess={() => {}} />;
}
