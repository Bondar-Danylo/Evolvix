import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import EmployeeListPage from "./pages/EmployeeListPage/EmployeeListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoadingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route index path="/dashboard" element={<HomePage />} />
          <Route path="/employee-list" element={<EmployeeListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
