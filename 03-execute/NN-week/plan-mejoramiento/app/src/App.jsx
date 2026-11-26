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
    { name: "Dashboard", label: "Panel de control", icon: "▦" },
    { name: "Instruments", label: "Instrumentos", icon: "♫" },
    { name: "Categories", label: "Categorías", icon: "▤" },
    { name: "Students", label: "Estudiantes", icon: "♙" },
    { name: "Loans", label: "Préstamos", icon: "▣" },
    { name: "Returns", label: "Devoluciones", icon: "↩" },
  ];

  const activePageLabel = menuItems.find(
    (item) => item.name === activePage
  )?.label;

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
              {item.label}
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
            <strong>{activePageLabel}</strong>
          </div>

          <div className="user-profile">
            <div className="avatar">A</div>
            <span>Administrador</span>
          </div>
        </header>

        <section className="page-content">
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Instruments" && <Instruments />}
          {activePage === "Categories" && <Categories />}
          {activePage === "Students" && <Students />}
          {activePage === "Loans" && <Loans />}
          {activePage === "Returns" && <Returns />}
        </section>
      </main>
    </div>
  );
}

export default App;