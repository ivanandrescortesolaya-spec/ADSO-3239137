
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Instruments from "./pages/Instruments";
import Categories from "./pages/Categories";
import Students from "./pages/Students";
import Loans from "./pages/Loans";
import Returns from "./pages/Returns";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Instrumentos", icon: "♫" },
    { name: "Categorías", icon: "▤" },
    { name: "Estudiantes", icon: "♙" },
    { name: "Préstamos", icon: "▣" },
    { name: "Devoluciones", icon: "↩" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♫</div>
          <div>
            <h2>Music School</h2>
            <span>ADMINISTRACIÓN</span>
          </div>
        </div>

        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Music School</span>
          <small>Sistema de préstamo de instrumentos</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Principal /</span>
            <strong>{activePage}</strong>
          </div>

          <div className="user-profile">
            <div className="avatar">A</div>
            <span>Administrador</span>
          </div>
        </header>

        <section className="page-content">
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Instrumentos" && <Instruments />}
          {activePage === "Categorías" && <Categories />}
          {activePage === "Estudiantes" && <Students />}
          {activePage === "Préstamos" && <Loans />}
          {activePage === "Devoluciones" && <Returns />}
        </section>
      </main>
    </div>
  );
}
export default App;
