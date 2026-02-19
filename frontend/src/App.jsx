import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeLayout from './layout/HomeLayout';
import Login from './components/Home/Login';
import Signup from './components/Home/Signup';
import UserLayout from './components/User/UserLayout';
import PageNotFound from './components/PageNotFound';

import './App.css';
import ForgotPassword from './components/Home/ForgotPassword';
import Dashboard from './components/User/Dashboard';
import Report from './components/User/Report';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home Layout */}
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* User Layout */}
        <Route path="/app/user" element={<UserLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="report" element={<Report />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
