
import Categories from "./pages/Categories";
import Students from "./pages/Students";
import Loans from "./pages/Loans";
import Returns from "./pages/Returns";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import {
  getInstruments,
  createInstrument,
} from "./services/instrumentService";
import { getCategories } from "./services/categoryService";
import "./App.css";


function App() {
  const [instruments, setInstruments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    category_id: "",
    code: "",
    name: "",
    total_units: "",
  });

  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setError("");

      const [instrumentResponse, categoryResponse] =
        await Promise.all([
          getInstruments(),
          getCategories(),
        ]);

      const instrumentList = Array.isArray(instrumentResponse)
        ? instrumentResponse
        : instrumentResponse.data ?? [];

      const categoryList = Array.isArray(categoryResponse)
        ? categoryResponse
        : categoryResponse.data ?? [];

      setInstruments(instrumentList);
      setCategories(categoryList);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar la informacion del sistema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.category_id ||
      !form.code.trim() ||
      !form.name.trim() ||
      form.total_units === ""
    ) {
      setError("Completa todos los campos del formulario.");
      return;
    }

    const totalUnits = Number(form.total_units);

    if (!Number.isInteger(totalUnits) || totalUnits < 0) {
      setError("Las unidades deben ser un numero entero igual o mayor que cero.");
      return;
    }

    try {
      setSaving(true);

      await createInstrument({
        category_id: Number(form.category_id),
        code: form.code.trim(),
        name: form.name.trim(),
        total_units: totalUnits,
      });

      setForm({
        category_id: "",
        code: "",
        name: "",
        total_units: "",
      });

      setShowForm(false);
      setSuccess("Instrumento registrado correctamente.");

      await loadData();
    } catch (err) {
      console.error(err);

      const responseData = err.response?.data;

      if (responseData?.errors) {
        const firstError = responseData.errors.category_id?.[0]
          || Object.values(responseData.errors).flat()[0];

        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          responseData?.mensaje ||
          responseData?.message ||
          "No fue posible registrar el instrumento."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredInstruments = instruments.filter((instrument) => {
    const term = search.toLowerCase();

    return (
      instrument.name.toLowerCase().includes(term) ||
      instrument.code.toLowerCase().includes(term)
    );
  });

  const totalInstruments = instruments.length;

  const totalUnits = instruments.reduce(
    (total, item) => total + Number(item.total_units || 0),
    0
  );

  const availableUnits = instruments.reduce(
    (total, item) => total + Number(item.available_units || 0),
    0
  );

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Instrumentos", icon: "♫" },
    { name: "Categorias", icon: "▤" },
    { name: "Estudiantes", icon: "♙" },
    { name: "Prestamos", icon: "▣" },
    { name: "Devoluciones", icon: "↩" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♫</div>
          <div>
            <h2>Music School</h2>
            <span>ADMINISTRACION</span>
          </div>
        </div>

        <p className="menu-label">MENU PRINCIPAL</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => {
                setActivePage(item.name);
                setError("");
                setSuccess("");
              }}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Music School</span>
          <small>Sistema de prestamo de instrumentos</small>
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

          {activePage === "Instrumentos" && (
            <>
              <div className="page-heading">
                <h1>Instrumentos</h1>
                <p>Administra el inventario de instrumentos musicales.</p>
              </div>

              {success && (
                <div className="success-message">{success}</div>
              )}

              {error && (
                <div className="error-message">{error}</div>
              )}

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Inventario de instrumentos</h2>
                    <p>Consulta y registra instrumentos en el sistema.</p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setShowForm(!showForm);
                    }}
                  >
                    + Nuevo instrumento
                  </button>
                </div>

                {showForm && (
                  <form className="instrument-form" onSubmit={handleSubmit}>
                    <h3>Registrar instrumento</h3>

                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="category_id">Categoria</label>
                        <select
                          id="category_id"
                          name="category_id"
                          value={form.category_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecciona una categoria</option>

                          {categories.filter((category) => category.is_active).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label htmlFor="code">Codigo</label>
                        <input
                          id="code"
                          name="code"
                          value={form.code}
                          onChange={handleChange}
                          placeholder="Ej. GTR-011"
                          maxLength={30}
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="name">Nombre del instrumento</label>
                        <input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Ej. Guitarra acustica"
                          required
                        />
                      </div>

                      <div className="form-field">
                        <label htmlFor="total_units">Unidades totales</label>
                        <input
                          id="total_units"
                          name="total_units"
                          type="number"
                          min="0"
                          step="1"
                          value={form.total_units}
                          onChange={handleChange}
                          placeholder="Ej. 5"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setShowForm(false)}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                      >
                        {saving ? "Guardando..." : "Guardar instrumento"}
                      </button>
                    </div>
                  </form>
                )}

                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Buscar por codigo o nombre..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                {loading ? (
                  <p className="loading-message">Cargando instrumentos...</p>
                ) : (
                  <InstrumentTable instruments={filteredInstruments} />
                )}
              </section>
            </>
          )}

            {activePage === "Categorias" && <Categories />}

            {activePage === "Estudiantes" && <Students />}

            {activePage === "Prestamos" && <Loans />}

            {activePage === "Devoluciones" && <Returns />}
        </section>
      </main>
    </div>
  );
}

function InstrumentTable({ instruments }) {
  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Instrumento</th>
            <th>Total</th>
            <th>Disponibles</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {instruments.length === 0 ? (
            <tr>
              <td colSpan="5">No se encontraron instrumentos.</td>
            </tr>
          ) : (
            instruments.map((instrument) => (
              <tr key={instrument.id}>
                <td>{instrument.code}</td>
                <td>{instrument.name}</td>
                <td>{instrument.total_units}</td>
                <td>{instrument.available_units}</td>
                <td>
                  <span
                    className={
                      instrument.is_active
                        ? "status active-status"
                        : "status inactive-status"
                    }
                  >
                    {instrument.is_active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
