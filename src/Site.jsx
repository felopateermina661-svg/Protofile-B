import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "./supabase";
import {
  Menu,
  X,
  Send,
  ChevronsDown,
  ChevronsUp,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import logo from "./assets/VE.jpg"; // ⬅️ لوجو VE for edits

const WHATSAPP_NUMBER = "201016396460"; // ⬅️ بدون + وبدون مسافات

// فيديوهات افتراضية تظهر لو لسه محدش ضاف فيديوهات من لوحة الأدمن
const FALLBACK_WORKS = [
  { id: "w1", videoId: "dQw4w9WgXcQ", title: "مونتاج ريلز - حملة إعلانية" },
  { id: "w2", videoId: "dQw4w9WgXcQ", title: "فيديو موشن جرافيك" },
  { id: "w3", videoId: "dQw4w9WgXcQ", title: "كليب سينمائي قصير" },
  { id: "w4", videoId: "dQw4w9WgXcQ", title: "توثيق مناسبة" },
];

const NAV_LINKS = [
  { label: "My Works", id: "works" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ---------------- نص بيتكتب حرف بحرف ثم يمسح ويتكتب تاني (لوب) ---------------- */
function TypewriterText({ text, className, style, highlightWord, highlightClassName }) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let timer;
    if (phase === "typing") {
      if (display.length < text.length) {
        timer = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 36);
      } else {
        timer = setTimeout(() => setPhase("erasing"), 2000);
      }
    } else if (phase === "erasing") {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 18);
      } else {
        timer = setTimeout(() => setPhase("typing"), 350);
      }
    }
    return () => clearTimeout(timer);
  }, [display, phase, text]);

  let content = display;
  if (highlightWord) {
    const idx = text.indexOf(highlightWord);
    if (idx !== -1) {
      const wordEnd = idx + highlightWord.length;
      const typedLen = display.length;
      const before = text.slice(0, Math.min(typedLen, idx));
      const wordTyped = text.slice(idx, Math.min(typedLen, wordEnd));
      const after = text.slice(wordEnd, typedLen);
      content = (
        <>
          {before}
          <span className={highlightClassName}>{wordTyped}</span>
          {after}
        </>
      );
    }
  }

  return (
    <p dir="rtl" className={className} style={style}>
      {content}
      <span className="typewriter-cursor">|</span>
    </p>
  );
}

/* ---------------- نص الهيدر بيتكتب حرف بحرف ---------------- */
function HeaderTypewriter({ text, className, style }) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let timer;
    if (phase === "typing") {
      if (display.length < text.length) {
        timer = setTimeout(() => setDisplay(text.slice(0, display.length + 1)), 160);
      } else {
        timer = setTimeout(() => setPhase("erasing"), 2600);
      }
    } else if (phase === "erasing") {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(text.slice(0, display.length - 1)), 80);
      } else {
        timer = setTimeout(() => setPhase("typing"), 700);
      }
    }
    return () => clearTimeout(timer);
  }, [display, phase, text]);

  return (
    <span className={className} style={style}>
      {display}
      <span className="header-typewriter-cursor">|</span>
    </span>
  );
}

/* ---------------- الهيدر + المنيو ---------------- */
/* ديسكتوب/لابتوب: الروابط ظاهرة على طول جنب بعض، من غير همبرجر
   موبايل: أيقونة همبرجر واحدة بتفتح منها المنيو الجانبي */
function Header({ onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleClick = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        className="sticky top-0 z-50 bg-[#07070A]/85 backdrop-blur-xl border-b border-white/10"
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-[72px]">
          {/* همبرجر - موبايل بس */}
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-white/25 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <HeaderTypewriter
            text="Video Editor"
            className="text-[15px] font-bold tracking-wide text-[#C4B5FD]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          />

          {/* روابط ديسكتوب - ظاهرة على طول */}
          <nav dir="rtl" className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => handleClick(link.id)}
                className={`text-[14px] transition-colors ${
                  link.id === "works"
                    ? "font-bold text-[#C4B5FD]"
                    : "font-medium text-[#B4B4BE] hover:text-white"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* منيو الموبايل المنسدلة */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              className="fixed inset-0 z-[100] backdrop-blur-md md:hidden"
            />
            <motion.nav
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              dir="rtl"
              style={{ backgroundColor: "#0C0C11" }}
              className="fixed top-0 left-0 z-[101] h-full w-[78%] max-w-[300px] border-r border-white/10 shadow-2xl md:hidden"
            >
              <div
                className="flex items-center justify-between px-6 h-[72px] border-b border-white/10"
                style={{ backgroundColor: "#0C0C11" }}
              >
                <HeaderTypewriter
                  text="Video Editor"
                  className="text-[15px] font-bold tracking-wide text-[#C4B5FD]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                />
                <button
                  aria-label="قفل المنيو"
                  onClick={() => setOpen(false)}
                  className="text-white w-9 h-9 flex items-center justify-center rounded-full border border-white/10 hover:border-white/25 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="flex flex-col px-6 py-6 gap-1 h-[calc(100%-72px)]"
                style={{ backgroundColor: "#0C0C11" }}
              >
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleClick(link.id)}
                    className={`text-right py-3 text-[16px] transition-colors ${
                      link.id === "works"
                        ? "font-bold text-[#C4B5FD]"
                        : "font-medium text-[#B4B4BE] hover:text-white"
                    }`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ homeRef, onNavigate }) {
  return (
    <section ref={homeRef} className="px-6 md:px-10 pt-16 pb-10 max-w-3xl mx-auto">
      <div dir="rtl" className="text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
          dir="ltr"
          className="inline-flex items-center justify-center text-[34px] sm:text-[46px] font-black text-[#C4B5FD]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <span style={{ letterSpacing: "0.04em" }}>VE</span>
          <span className="inline-flex items-center ml-3 sm:ml-4">
            F
            <img
              src={logo}
              alt="o"
              className="inline-block w-[0.75em] h-[0.75em] rounded-full object-cover mx-[1px] self-center"
            />
            r
          </span>
          <span className="ml-3 sm:ml-4" style={{ letterSpacing: "0.04em" }}>Editor</span>
        </motion.div>

        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
          custom={0.1}
          className="mt-6 pt-3 pb-5 leading-[1.3] text-[56px] sm:text-[76px] lg:text-[88px] relative inline-block font-black text-white"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          أعمالي
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{
              duration: 3.4,
              times: [0, 0.3, 0.85, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "right center" }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[6px] rounded-full bg-gradient-to-l from-[#7C3AED] to-[#38BDF8]"
          />
        </motion.h1>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
          custom={0.2}
          dir="rtl"
          className="mt-9 text-[#A1A1AA] text-[17px] sm:text-[18px] leading-relaxed max-w-md mx-auto"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          أحول اللقطات الخام إلى فيديوهات تحكي{" "}
          <span className="text-[#C4B5FD] font-bold">قصة</span>، تلمس المشاعر
          وتترك أثر.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
          custom={0.3}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => onNavigate("contact")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white bg-gradient-to-l from-[#7C3AED] to-[#A855F7] hover:brightness-110 transition"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <Send size={16} />
            تواصل معي
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- كارت الفيديو ---------------- */
function VideoCard({ work, index }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={fadeUp}
      custom={index * 0.08}
      dir="rtl"
      className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col"
    >
      <div className="aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${work.videoId}`}
          title={work.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-5">
        <h3
          className="text-white font-bold text-[16px]"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {work.title}
        </h3>
      </div>
    </motion.div>
  );
}

/* ---------------- شبكة الفيديوهات - بتقرأ من Firestore لحظيًا ---------------- */
function WorksGrid({ worksRef }) {
  const [works, setWorks] = useState(FALLBACK_WORKS);

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setWorks(data.map((w) => ({ id: w.id, title: w.title, videoId: w.video_id })));
    } else {
      setWorks(FALLBACK_WORKS);
    }
  };

  useEffect(() => {
    fetchWorks();

    // الاستماع اللحظي لأي فيديو جديد يتضاف من لوحة الأدمن
    const channel = supabase
      .channel("public-works-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "works" },
        () => fetchWorks()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section ref={worksRef} className="pb-24">
      <div
        dir="rtl"
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 md:px-10 pb-4 no-scrollbar scroll-smooth"
      >
        {works.map((w, i) => (
          <div key={w.id} className="snap-center shrink-0 w-[85%] sm:w-[400px]">
            <VideoCard work={w} index={i} />
          </div>
        ))}
      </div>

      <p
        dir="rtl"
        className="text-center text-[#6B6B76] text-[12px] mt-2"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        اسحب يمين أو شمال لباقي الفيديوهات ←
      </p>
    </section>
  );
}

/* ---------------- صفحة "من أنا" ---------------- */
function About({ aboutRef, projectsCount, viewsCount }) {
  return (
    <section
      ref={aboutRef}
      dir="rtl"
      className="px-6 md:px-10 py-24 max-w-4xl mx-auto text-center lg:text-right"
    >
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#7DD3FC] text-[13px] font-bold"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <Sparkles size={14} />
        ABOUT ME
      </motion.span>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.1}
        className="mt-6 text-white font-black text-[42px] sm:text-[54px]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        بيشوي زاير
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.2}
        className="mt-6 text-[#A1A1AA] text-[17px] leading-loose max-w-2xl mx-auto lg:mx-0"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        بدأت رحلتي مع المونتاج من فضول بسيط: إزاي لحظة عادية تتحول لحكاية
        الناس بتوقف عندها. من ساعتها وأنا شايف إن كل فيديو هو فرصة إني
        أحكي حاجة حقيقية، مش بس أرتب كليبات ورا بعض. بحب أشتغل على التفاصيل
        الصغيرة اللي محدش بيلاحظها، لأنها هي اللي بتفرق بين فيديو عادي
        وفيديو بيسيبك تفكر فيه بعد ما يخلص.
      </motion.p>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.3}
        className="mt-4 text-[#A1A1AA] text-[17px] leading-loose max-w-2xl mx-auto lg:mx-0"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        الدنيا بتتغير بسرعة، والمحتوى اللي بيوصل هو اللي بيحس بيه الناس مش
        بس بيشوفوه. وده بالظبط اللي بحاول أوصله في كل مشروع بشتغل عليه.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.4}
        className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0"
      >
        {[
          { label: "مشروع", value: `${projectsCount}+` },
          { label: "عميل راضي", value: "25+" },
          { label: "سنين خبرة", value: "3+" },
          { label: "مشاهدة", value: String(viewsCount) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] py-5 px-3 text-center"
          >
            <div className="text-white font-black text-[24px]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {stat.value}
            </div>
            <div className="text-[#A1A1AA] text-[12px] mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------- صفحة التواصل (واتساب) ---------------- */
function Contact({ contactRef }) {
  const [message, setMessage] = useState("");

  const sendToWhatsApp = () => {
    const text = message.trim();
    if (!text) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section
      ref={contactRef}
      dir="rtl"
      className="px-6 md:px-10 py-24 max-w-2xl mx-auto text-center"
    >
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 text-[#4ADE80] text-[13px] font-bold"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <MessageCircle size={14} />
        CONTACT
      </motion.span>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.1}
        className="mt-6 text-white font-black text-[38px] sm:text-[46px]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        تواصل معايا
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.2}
        className="mt-4 text-[#A1A1AA] text-[15px]"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        اكتب رسالتك وهتتبعتلي على واتساب على طول
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={fadeUp}
        custom={0.3}
        className="mt-8 flex flex-col gap-4"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          rows={5}
          className="w-full resize-none rounded-2xl bg-white/5 border border-white/10 focus:border-[#22C55E]/60 outline-none px-4 py-3.5 text-[15px] text-white placeholder:text-white/30"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        />
        <button
          onClick={sendToWhatsApp}
          disabled={!message.trim()}
          className="mx-auto inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-l from-[#22C55E] to-[#16A34A] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <Send size={16} />
          ابعت على واتساب
        </button>
      </motion.div>
    </section>
  );
}

/* ---------------- أزرار السكرول العائمة ---------------- */
function ScrollButtons() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setShowUp(scrolled > 400);
      setShowDown(scrolled < max - 200);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      <AnimatePresence>
        {showDown && (
          <motion.button
            key="down"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={scrollToBottom}
            aria-label="انزل لآخر الصفحة"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-xl bg-white/[0.06] border border-white/15 shadow-[0_0_20px_-4px_rgba(124,58,237,0.6)] hover:border-[#7C3AED]/50 transition"
          >
            <ChevronsDown size={19} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showUp && (
          <motion.button
            key="up"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={scrollToTop}
            aria-label="ارجع لأول الصفحة"
            className="w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-xl bg-white/[0.06] border border-white/15 shadow-[0_0_20px_-4px_rgba(56,189,248,0.6)] hover:border-[#38BDF8]/50 transition"
          >
            <ChevronsUp size={19} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- الموقع الرئيسي ---------------- */
export default function Site() {
  const homeRef = useRef(null);
  const worksRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [views, setViews] = useState(0);

  const refs = { home: homeRef, works: worksRef, about: aboutRef, contact: contactRef };

  const handleNavigate = (id) => {
    refs[id]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    try {
      const next = parseInt(localStorage.getItem("site-views") || "0", 10) + 1;
      localStorage.setItem("site-views", String(next));
      setViews(next);
    } catch (e) {
      console.error("تعذّر تحديث عداد المشاهدات:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07070A]">
      <Header onNavigate={handleNavigate} />
      <Hero homeRef={homeRef} onNavigate={handleNavigate} />
      <WorksGrid worksRef={worksRef} />
      <About aboutRef={aboutRef} projectsCount={4} viewsCount={views} />
      <Contact contactRef={contactRef} />
      <ScrollButtons />

      <style>{`
        html { scroll-behavior: smooth; }
        .ring-spin { animation: spin-ring 8s linear infinite; }
        @keyframes spin-ring { to { transform: rotate(360deg); } }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .typewriter-cursor {
          display: inline-block;
          margin-right: 2px;
          color: #A855F7;
          animation: blink-cursor 0.9s step-end infinite;
        }
        .header-typewriter-cursor {
          display: inline-block;
          margin-right: 2px;
          color: currentColor;
          animation: blink-cursor 0.9s step-end infinite;
        }
        @keyframes blink-cursor { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .ring-spin { animation: none; }
          html { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
}
