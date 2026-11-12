
import { useEffect, useMemo, useState } from "react";
import {
  getInstruments,
  createInstrument,
} from "../services/instrumentService";
import { getCategories } from "../services/categoryService";
import { getLoans } from "../services/loanService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function Instruments() {
  const [instruments, setInstruments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [form, setForm] = useState({
    category_id: "",
    code: "",
    name: "",
    total_units: "",
  });

  const loadData = async () => {
    try {
      setError("");

      const [instrumentResponse, categoryResponse, loanResponse] =
        await Promise.all([
          getInstruments(),
          getCategories(),
          getLoans(),
        ]);

      setInstruments(getList(instrumentResponse));
      setCategories(getList(categoryResponse));
      setLoans(getList(loanResponse));
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar la información del inventario.");
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
      setError("Las unidades deben ser un número entero igual o mayor que cero.");
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
        const firstError =
          responseData.errors.category_id?.[0] ||
          Object.values(responseData.errors).flat()[0];

        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          responseData?.message ||
          "No fue posible registrar el instrumento."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const totalInstruments = instruments.length;

  const totalUnits = instruments.reduce(
    (total, item) => total + Number(item.total_units || 0),
    0
  );

  const availableUnits = instruments.reduce(
    (total, item) => total + Number(item.available_units || 0),
    0
  );

  const activeLoans = loans.filter(
    (loan) => loan.return_record == null
  ).length;

  const availabilityPercentage =
    totalUnits > 0
      ? Math.round((availableUnits / totalUnits) * 100)
      : 0;

  const filteredInstruments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return instruments.filter((instrument) => {
      const matchesSearch =
        String(instrument.name ?? "").toLowerCase().includes(term) ||
        String(instrument.code ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "activos" && instrument.is_active) ||
        (statusFilter === "inactivos" && !instrument.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [instruments, search, statusFilter]);

  return (
    <div className="instruments-page">
      <section className="instrument-hero">
        <div className="instrument-hero-content">
          <span className="hero-eyebrow">GESTIÓN DEL INVENTARIO</span>
          <h1>Panel de Inventario Musical</h1>
          <p>
            Administra, consulta y controla los instrumentos musicales
            de Music School desde un solo lugar.
          </p>
          <div className="hero-decoration-line" />
        </div>

        <div className="hero-music-art" aria-hidden="true">
          <span className="music-note note-one">♫</span>
          <span className="music-note note-two">♪</span>
          <span className="music-note note-three">♬</span>
          <div className="music-disc">
            <div className="music-disc-center">♫</div>
          </div>
        </div>
      </section>

      {success && (
        <div className="success-message">{success}</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      <div className="instrument-section-heading">
        <div>
          <span className="section-eyebrow">RESUMEN GENERAL</span>
          <h2>Estado del inventario</h2>
          <p>Indicadores actualizados desde el sistema.</p>
        </div>
      </div>

      <section className="stats-grid instrument-stats">
        <article className="stat-card instrument-stat-card">
          <div className="instrument-stat-top">
            <span className="stat-icon blue">♫</span>
            <span className="stat-trend">Catálogo</span>
          </div>
          <p>Tipos de instrumentos</p>
          <h2>{loading ? "—" : totalInstruments}</h2>
          <small>Registrados en el catálogo</small>
        </article>

        <article className="stat-card instrument-stat-card">
          <div className="instrument-stat-top">
            <span className="stat-icon purple">▤</span>
            <span className="stat-trend">Inventario</span>
          </div>
          <p>Unidades totales</p>
          <h2>{loading ? "—" : totalUnits}</h2>
          <small>Ejemplares registrados</small>
        </article>

        <article className="stat-card instrument-stat-card">
          <div className="instrument-stat-top">
            <span className="stat-icon green">✓</span>
            <span className="stat-trend">{availabilityPercentage}%</span>
          </div>
          <p>Unidades disponibles</p>
          <h2>{loading ? "—" : availableUnits}</h2>
          <small>Disponibles para préstamo</small>
        </article>

        <article className="stat-card instrument-stat-card">
          <div className="instrument-stat-top">
            <span className="stat-icon orange">↗</span>
            <span className="stat-trend">En circulación</span>
          </div>
          <p>Préstamos activos</p>
          <h2>{loading ? "—" : activeLoans}</h2>
          <small>Pendientes de devolución registrada</small>
        </article>
      </section>

      <section className="panel instrument-panel">
        <div className="panel-heading instrument-panel-heading">
          <div>
            <span className="section-eyebrow">CATÁLOGO MUSICAL</span>
            <h2>Inventario de instrumentos</h2>
            <p>Consulta y administra los instrumentos registrados.</p>
          </div>

          <button
            className="primary-button instrument-add-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowForm((previous) => !previous);
            }}
          >
            <span>＋</span> Nuevo instrumento
          </button>
        </div>

        {showForm && (
          <form className="instrument-form" onSubmit={handleSubmit}>
            <h3>Registrar instrumento</h3>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="category_id">Categoría</label>
                <select
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories
                    .filter((category) => category.is_active)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="code">Código</label>
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
                  placeholder="Ej. Guitarra acústica"
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

        <div className="instrument-toolbar">
          <div className="instrument-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Buscar por código o nombre..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <label className="instrument-filter">
            <span>Estado:</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="loading-message">Cargando inventario...</p>
        ) : (
          <>
            <div className="instrument-table-summary">
              <span>
                Mostrando <strong>{filteredInstruments.length}</strong> de{" "}
                <strong>{totalInstruments}</strong> instrumentos
              </span>
            </div>

            <InstrumentTable instruments={filteredInstruments} />
          </>
        )}
      </section>
    </div>
  );
}

function InstrumentTable({ instruments }) {
  return (
    <div className="table-container instrument-table-container">
      <table className="inventory-table instrument-modern-table">
        <thead>
          <tr>
            <th>CÓDIGO</th>
            <th>INSTRUMENTO</th>
            <th>CATEGORÍA</th>
            <th>TOTAL</th>
            <th>DISPONIBLES</th>
            <th>ESTADO</th>
          </tr>
        </thead>

        <tbody>
          {instruments.length === 0 ? (
            <tr>
              <td colSpan="6" className="instrument-empty">
                No se encontraron instrumentos.
              </td>
            </tr>
          ) : (
            instruments.map((instrument) => (
              <tr key={instrument.id}>
                <td>
                  <span className="instrument-code">
                    {instrument.code}
                  </span>
                </td>
                <td>
                  <div className="instrument-name-cell">
                    <span className="instrument-row-icon">♫</span>
                    <strong>{instrument.name}</strong>
                  </div>
                </td>
                <td>{instrument.category?.name || "Sin categoría"}</td>
                <td>{instrument.total_units}</td>
                <td>
                  <span className="available-count">
                    {instrument.available_units}
                  </span>
                </td>
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

export default Instruments;
