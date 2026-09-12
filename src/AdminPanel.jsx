import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// بيقبل لينك يوتيوب كامل أو الـ ID لوحده، ويطلع منه الـ videoId بس
function extractVideoId(input) {
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export default function AdminPanel() {
  const [title, setTitle] = useState("");
  const [videoInput, setVideoInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setVideos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    const videoId = extractVideoId(videoInput);
    if (!videoId) {
      setError("لينك اليوتيوب مش صح، تأكد منه");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "works"), {
        title: title.trim(),
        videoId,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setVideoInput("");
    } catch (err) {
      setError("حصل خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "works", id));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#07070A] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-white font-black text-[26px]"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            إدارة الفيديوهات
          </h1>
          <button
            onClick={() => signOut(auth)}
            className="text-[13px] text-[#A1A1AA] hover:text-white border border-white/10 rounded-full px-4 py-2"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            تسجيل خروج
          </button>
        </div>

        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="عنوان الفيديو"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-[#7C3AED]/60 outline-none px-4 py-3 text-white placeholder:text-white/30"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
          <input
            type="text"
            placeholder="لينك اليوتيوب أو الـ ID"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            required
            dir="ltr"
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-[#7C3AED]/60 outline-none px-4 py-3 text-white placeholder:text-white/30 text-left"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
          {error && <p className="text-red-400 text-[13px]">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="py-3 rounded-full font-bold text-white bg-gradient-to-l from-[#7C3AED] to-[#A855F7] hover:brightness-110 transition disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            {saving ? "جاري الإضافة..." : "أضف الفيديو"}
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {videos.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <button
                onClick={() => handleDelete(v.id)}
                className="text-red-400 text-[13px] border border-red-400/30 rounded-full px-3 py-1 hover:bg-red-400/10"
              >
                حذف
              </button>
              <p
                className="text-white text-[14px]"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                {v.title}
              </p>
            </div>
          ))}
          {videos.length === 0 && (
            <p className="text-[#6B6B76] text-center text-[13px]">
              مفيش فيديوهات لسه، ضيف أول واحد من الفورم فوق
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
