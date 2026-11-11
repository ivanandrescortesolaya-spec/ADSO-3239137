
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategoryStatus,
} from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changingCategoryId, setChangingCategoryId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
  });

  const loadCategories = async () => {
    try {
      setError("");
      const response = await getCategories();
      setCategories(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar las categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
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
      setSuccess("Categoria registrada correctamente.");

      await loadCategories();
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          data?.message ||
          "No fue posible registrar la categoria."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (category) => {
    const nextActive = !category.is_active;
    const action = nextActive ? "activar" : "desactivar";

    if (!window.confirm(`Deseas ${action} la categoria ${category.name}?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setChangingCategoryId(category.id);

    try {
      await updateCategoryStatus(category.id, nextActive);
      setSuccess(`Categoria ${nextActive ? "activada" : "desactivada"} correctamente.`);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "No fue posible actualizar el estado de la categoria.");
    } finally {
      setChangingCategoryId(null);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1>Categorias</h1>
        <p>Administra las categorias de instrumentos musicales.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Listado de categorias</h2>
            <p>Consulta y registra las categorias del inventario.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowForm(!showForm);
            }}
          >
            + Nueva categoria
          </button>
        </div>

        {showForm && (
          <form className="instrument-form" onSubmit={handleSubmit}>
            <h3>Registrar categoria</h3>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="category-code">Codigo</label>
                <input
                  id="category-code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Ej. CAT-06"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category-name">Nombre</label>
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
                {saving ? "Guardando..." : "Guardar categoria"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="loading-message">Cargando categorias...</p>
        ) : (
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nombre de categoria</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4">No hay categorias registradas.</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.code}</td>
                      <td>{category.name}</td>
                      <td>{category.is_active ? "Activa" : "Inactiva"}</td>
                      <td>
                        <button
                          className={category.is_active ? "secondary-button" : "primary-button"}
                          onClick={() => handleStatusChange(category)}
                          disabled={changingCategoryId === category.id}
                        >
                          {changingCategoryId === category.id
                            ? "Actualizando..."
                            : category.is_active ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default Categories;
