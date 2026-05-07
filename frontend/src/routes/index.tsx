import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { RunTestPage } from '../pages/RunTestPage';
import { ReportPage } from '../pages/ReportPage';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-[#71717A] font-medium">{title} — Coming soon</p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/run-test" replace />} />
        <Route path="/run-test" element={<RunTestPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="/help" element={<PlaceholderPage title="Help" />} />
        <Route path="*" element={<Navigate to="/run-test" replace />} />
      </Route>
    </Routes>
  );
}
