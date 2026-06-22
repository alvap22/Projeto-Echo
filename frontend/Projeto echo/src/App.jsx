import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateReview from "./pages/CreateReview";
import AdminPanel from "./pages/AdminPanel";
import ReviewDetail from "./pages/ReviewDetail";
import EditReview from "./pages/EditReview";
import PublicProfile from "./pages/PublicProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/create-review" element={<CreateReview />} />

        <Route path="/admin" element={<AdminPanel />}/>

        <Route path="/review/:id" element={<ReviewDetail />} />

        <Route path="/edit-review/:id" element={<EditReview />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;