import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess?.();
    } catch (err) {
      setError("بيانات الدخول غلط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#07070A] flex items-center justify-center px-6"
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
      >
        <h1
          className="text-white font-black text-[24px] text-center mb-6"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          دخول الأدمن
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="الإيميل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-[#7C3AED]/60 outline-none px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-[#7C3AED]/60 outline-none px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />

          {error && (
            <p className="text-red-400 text-[13px] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-full font-bold text-white bg-gradient-to-l from-[#7C3AED] to-[#A855F7] hover:brightness-110 transition disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </div>
      </form>
    </div>
  );
}
