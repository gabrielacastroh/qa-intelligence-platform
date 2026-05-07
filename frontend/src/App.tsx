import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}
