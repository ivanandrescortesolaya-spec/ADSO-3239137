
import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategoryStatus,
} from "../services/categoryService";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changingCategoryId, setChangingCategoryId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const loadCategories = async () => {
    try {
      setError("");
      const response = await getCategories();
      setCategories(Array.isArray(response) ? response : response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.code.trim() || !form.name.trim()) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      setSaving(true);

      await createCategory({
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
      });

      setForm({ code: "", name: "" });
      setShowForm(false);
      setSuccess("Categoría registrada correctamente.");
      await loadCategories();
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(data?.message || "No fue posible registrar la categoría.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (category) => {
    const nextActive = !category.is_active;
    const action = nextActive ? "activar" : "desactivar";

    if (!window.confirm(`¿Deseas ${action} la categoría ${category.name}?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setChangingCategoryId(category.id);

    try {
      await updateCategoryStatus(category.id, nextActive);
      setSuccess(
        `Categoría ${nextActive ? "activada" : "desactivada"} correctamente.`
      );
      await loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No fue posible actualizar el estado de la categoría."
      );
    } finally {
      setChangingCategoryId(null);
    }
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter(
    (category) => category.is_active
  ).length;
  const inactiveCategories = totalCategories - activeCategories;

  // Se usa el contador de Laravel si está disponible.
  // Si no, se intenta contar la relación incluida en la respuesta.
  const categoriesWithInstruments = categories.filter((category) => {
    const count =
      category.instruments_count ?? category.instruments?.length ?? 0;
    return Number(count) > 0;
  }).length;

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        String(category.code ?? "").toLowerCase().includes(term) ||
        String(category.name ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && Boolean(category.is_active)) ||
        (statusFilter === "inactive" && !category.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const getCategoryIcon = (name = "") => {
    const value = name.toLowerCase();

    if (value.includes("cuerda")) return "♬";
    if (value.includes("viento")) return "♬";
    if (value.includes("percusión") || value.includes("percusion")) return "◉";
    if (value.includes("teclado")) return "▤";
    if (value.includes("electr")) return "≋";
    return "♫";
  };

  return (
    <div className="categories-page">
      <section className="categories-hero">
        <div className="categories-hero-content">
          <span className="categories-hero-eyebrow">
            GESTIÓN DEL CATÁLOGO
          </span>
          <h1>Categorías</h1>
          <p>
            Administra las categorías de instrumentos musicales,
            manteniendo el inventario organizado y actualizado.
          </p>
        </div>

        <div className="categories-hero-art" aria-hidden="true">
          <span className="category-note note-a">♫</span>
          <span className="category-note note-b">♪</span>
          <span className="category-note note-c">♬</span>
          <span className="category-music-symbol">♫</span>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="categories-stats">
        <article className="category-stat-card stat-blue">
          <div className="category-stat-icon">▱</div>
          <div>
            <p>Total de categorías</p>
            <h2>{loading ? "—" : totalCategories}</h2>
            <small>Registradas en el sistema</small>
          </div>
        </article>

        <article className="category-stat-card stat-green">
          <div className="category-stat-icon">✓</div>
          <div>
            <p>Categorías activas</p>
            <h2>{loading ? "—" : activeCategories}</h2>
            <small>Disponibles para su uso</small>
          </div>
        </article>

        <article className="category-stat-card stat-red">
          <div className="category-stat-icon">×</div>
          <div>
            <p>Categorías inactivas</p>
            <h2>{loading ? "—" : inactiveCategories}</h2>
            <small>No disponibles en el inventario</small>
          </div>
        </article>

        <article className="category-stat-card stat-purple">
          <div className="category-stat-icon">♫</div>
          <div>
            <p>Con instrumentos</p>
            <h2>{loading ? "—" : categoriesWithInstruments}</h2>
            <small>Tienen instrumentos asociados</small>
          </div>
        </article>
      </section>

      <section className="categories-panel">
        <div className="categories-panel-heading">
          <div className="categories-panel-title">
            <span className="categories-list-icon">▤</span>
            <div>
              <h2>Listado de categorías</h2>
              <p>Consulta, registra y gestiona las categorías del inventario.</p>
            </div>
          </div>

          <button
            className="categories-primary-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowForm((previous) => !previous);
            }}
          >
            <span>＋</span> Nueva categoría
          </button>
        </div>

        {showForm && (
          <form className="categories-form" onSubmit={handleSubmit}>
            <h3>Registrar categoría</h3>

            <div className="categories-form-grid">
              <div className="form-field">
                <label htmlFor="category-code">Código</label>
                <input
                  id="category-code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Ej. CAT-07"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category-name">Nombre de categoría</label>
                <input
                  id="category-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Instrumentos tradicionales"
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div className="categories-form-actions">
              <button
                type="button"
                className="categories-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="categories-primary-button"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar categoría"}
              </button>
            </div>
          </form>
        )}

        <div className="categories-toolbar">
          <div className="categories-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Buscar por código o nombre..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <label className="categories-filter">
            <span>Estado:</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </label>
        </div>

        {loading ? (
          <p className="loading-message">Cargando categorías...</p>
        ) : (
          <>
            <div className="categories-table-wrapper">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>CÓDIGO</th>
                    <th>NOMBRE DE CATEGORÍA</th>
                    <th>ESTADO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="categories-empty">
                        No se encontraron categorías.
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td>
                          <span className="categories-row-icon">
                            {getCategoryIcon(category.name)}
                          </span>
                        </td>
                        <td>
                          <span className="categories-code">
                            {category.code}
                          </span>
                        </td>
                        <td className="categories-name">{category.name}</td>
                        <td>
                          <span
                            className={
                              category.is_active
                                ? "category-status status-active"
                                : "category-status status-inactive"
                            }
                          >
                            <span className="category-status-dot"></span>
                            {category.is_active ? "Activa" : "Inactiva"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={
                              category.is_active
                                ? "category-status-button"
                                : "category-status-button activate"
                            }
                            onClick={() => handleStatusChange(category)}
                            disabled={changingCategoryId === category.id}
                          >
                            {changingCategoryId === category.id
                              ? "Actualizando..."
                              : category.is_active
                                ? "⏻  Desactivar"
                                : "✓  Activar"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="categories-footer">
              Mostrando {filteredCategories.length} de {totalCategories} categorías
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Categories;
