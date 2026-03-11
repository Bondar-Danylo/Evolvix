import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage/LoadingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import EmployeeListPage from "./pages/EmployeeListPage/EmployeeListPage";
import TrainingPage from "./pages/TrainingsPage/TrainingsPage";
import TopicsPage from "./pages/TopicsPage/TopicsPage";
import { useState } from "react";
import ProfilePageLayout from "./layouts/ProfilePageLayout/ProfilePageLayout";
import EmployeeTrainingsPage from "./pages/EmployeeTrainingsPage/EmployeeTrainingsPage";
import EmployeeTopicsPage from "./pages/EmployeeTopicsPage/EmployeeTopicsPage";

function App() {
  const [role, setRole] = useState<"admin" | "user">(() => {
    return (localStorage.getItem("userRole") as "admin" | "user") || "user";
  });

  const isAuth = localStorage.getItem("isAuth") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            isAuth ? (
              <Navigate to={role === "admin" ? "/dashboard" : "/trainings"} />
            ) : (
              <LoadingPage />
            )
          }
        />

        <Route
          path="/login"
          element={<LoginPage role={role} setRole={setRole} />}
        />
        {isAuth ? (
          <Route element={<DashboardLayout role={role} />}>
            <Route
              path="/profile"
              element={<ProfilePageLayout role={role} />}
            />

            {role === "admin" ? (
              <>
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/employee-list" element={<EmployeeListPage />} />
                <Route path="/trainings" element={<TrainingPage />} />
                <Route path="/topics" element={<TopicsPage />} />
              </>
            ) : (
              <>
                <Route path="/trainings" element={<EmployeeTrainingsPage />} />
                <Route path="/topics" element={<EmployeeTopicsPage />} />
              </>
            )}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuth
                  ? role === "admin"
                    ? "/dashboard"
                    : "/trainings"
                  : "/login"
              }
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
