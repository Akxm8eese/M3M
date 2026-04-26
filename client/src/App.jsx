import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import WorkoutsPage from './pages/WorkoutsPage';
import WaterPage from './pages/WaterPage';
import TodosPage from './pages/TodosPage';
import RemindersPage from './pages/RemindersPage';

function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <span>Agent</span>Flow
      </div>
      <nav className="app-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/workouts">Workouts</NavLink>
        <NavLink to="/water">Water</NavLink>
        <NavLink to="/todos">Tasks</NavLink>
        <NavLink to="/reminders">Reminders</NavLink>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
