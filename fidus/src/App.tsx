import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/client/ClientDashboard';
import CreateJob from './pages/client/CreateJob';
import JobDetail from './pages/client/JobDetail';
import PaymentPage from './pages/client/PaymentPage';
import ArtisanDashboard from './pages/artisan/ArtisanDashboard';
import JobFeedDetail from './pages/artisan/JobFeedDetail';
import KYCPage from './pages/artisan/KYCPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Client Routes (Protected) */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole="Client">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="job/:jobId" element={<JobDetail />} />
          <Route path="pay/:jobId/:bidId" element={<PaymentPage />} />
        </Route>

        {/* Artisan Routes (Protected) */}
        <Route
          path="/artisan"
          element={
            <ProtectedRoute allowedRole="Artisan">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ArtisanDashboard />} />
          <Route path="job/:jobId" element={<JobFeedDetail />} />
          <Route path="kyc" element={<KYCPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;