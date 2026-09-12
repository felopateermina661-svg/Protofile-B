import { Routes, Route } from "react-router-dom";
import Site from "./Site";
import AdminPage from "./AdminPage";

// صفحة /admin مش موجودة في أي منيو أو رابط ظاهر في الموقع نفسه،
// يعني محدش هيوصلها إلا لو عارف اللينك بالظبط ويكتبه بنفسه.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
