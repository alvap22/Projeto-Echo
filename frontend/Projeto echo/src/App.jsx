import ResetPassword from "./pages/ResetPassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateReview from "./pages/CreateReview";
import AdminPanel from "./pages/AdminPanel";
import ReviewDetail from "./pages/ReviewDetail";
import EditReview from "./pages/EditReview";
import PublicProfile from "./pages/PublicProfile";
import AdminReviewDetail from "./pages/AdminReviewDetail";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route path="/home" element={<Home />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-review"
          element={
            <ProtectedRoute>
              <CreateReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-review/:id"
          element={
            <ProtectedRoute>
              <EditReview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <PublicProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/review/:id"
          element={
            <ProtectedRoute>
              <AdminReviewDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;