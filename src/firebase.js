import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0EXuwo2hbbXfqdAaUQdBsTUlgd-Fsh4E",
  authDomain: "test-fd255.firebaseapp.com",
  projectId: "test-fd255",
  storageBucket: "test-fd255.firebasestorage.app",
  messagingSenderId: "104724365323",
  appId: "1:104724365323:web:316b5602c0226fcf33870e",
};

// ملحوظة: measurementId وgetAnalytics اتشالوا، لأننا مستخدمين بس
// Authentication وFirestore في المشروع ده (الأدمن والفيديوهات)،
// مش محتاجين تتبع إحصائيات الزوار (Analytics) دلوقتي.

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
