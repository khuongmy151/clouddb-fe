import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './features/auth/Login';
import Dashboard from './features/user/Dashboard';
import Users from './features/admin/Users';
import UserForm from './features/admin/UserForm';
import Profile from './features/profile/Profile';
import ChangePassword from './features/auth/ChangePassword';
import ForgotPassword from './features/auth/ForgotPassword';
import Databases from './features/user/Databases';
import CreateDatabase from './features/user/CreateDatabase';
import DatabaseDetail from './features/user/DatabaseDetail';
import Backups from './features/user/Backups';
import Notifications from './features/user/Notifications';
import Activities from './features/user/Activities';
import Monitoring from './features/admin/Monitoring';
import PersonalActivities from './features/user/PersonalActivities';
import Settings from './features/admin/Settings';
import ProfileEdit from './features/profile/ProfileEdit';
import Databasess from "./features/admin/Databasess";
import ProtectedRoute from './features/auth/ProtectedRoute';
export default function App() {
  return (
    <Routes>
      {/* Trang công khai (không cần đăng nhập) */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Các trang có Layout (sidebar) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/databases" element={<Databases />} />
          <Route path="/databases/create" element={<CreateDatabase />} />
          <Route path="/databases/:id" element={<DatabaseDetail />} />
          <Route path="/databases/:id/backups" element={<Backups />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/my-activities" element={<PersonalActivities />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/admin/databasess" element={<Databasess />} />

        </Route>
      </Route>

      {/* Mặc định chuyển về login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}