import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Guard from './Guard';
import './App.css';
import { lazy, Suspense } from 'react';
import Loader from './components/Shared/Loader';

const Login = lazy(() => import('./components/Home/Login'));
const Signup = lazy(() => import('./components/Home/Signup'));
const UserLayout = lazy(() => import('./components/User/UserLayout'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));
const ForgotPassword = lazy(() => import('./components/Home/ForgotPassword'));
const Dashboard = lazy(() => import('./components/User/Dashboard'));
const Report = lazy(() => import('./components/User/Report'));
const HomeLayout = lazy(() => import('./layout/HomeLayout'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader/>}>
        <Routes>

          {/* Home Layout */}
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* User Layout */}
          <Route path="/app/user"
            element={<Guard endpoint="/api/user/session" role="user">
              <UserLayout />
            </Guard>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="report" element={<Report />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
