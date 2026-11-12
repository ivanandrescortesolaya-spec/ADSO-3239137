
import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
} from "../services/studentService";
import "./Students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    student_code: "",
    full_name: "",
    email: "",
  };

  const [form, setForm] = useState(initialForm);

  // Load students from the API
  const loadStudents = async () => {
    try {
      setError("");
      const response = await getStudents();

      setStudents(
        Array.isArray(response) ? response : response.data ?? []
      );
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar los estudiantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handle form input changes
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Reset the form and editing state
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Create or update a student
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !form.student_code.trim() ||
      !form.full_name.trim() ||
      !form.email.trim()
    ) {
      setError("Completa todos los campos.");
      return;
    }

    const studentData = {
      student_code: form.student_code.trim(),
      full_name: form.full_name.trim(),
      email: form.email.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateStudent(editingId, studentData);
        setSuccess("Estudiante actualizado correctamente.");
      } else {
        await createStudent(studentData);
        setSuccess("Estudiante registrado correctamente.");
      }

      resetForm();
      await loadStudents();
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          data?.message || "No fue posible guardar el estudiante."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Load student information into the editing form
  const handleEdit = (student) => {
    setForm({
      student_code: student.student_code ?? "",
      full_name: student.full_name ?? "",
      email: student.email ?? "",
    });

    setEditingId(student.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Filter students by code, name, or email
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.student_code?.toLowerCase().includes(searchText) ||
      student.full_name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText)
    );
  });

  // Generate student initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div className="students-page">
      {/* Main banner */}
      <section className="students-hero">
        <div className="students-hero-content">
          <span className="students-hero-label">
            GESTIÓN ACADÉMICA
          </span>
          <h1>Estudiantes</h1>
          <p>
            Administra la información de los estudiantes,
            consulta sus registros y mantén actualizados sus datos.
          </p>
        </div>

        <div className="students-hero-art">
          <span className="students-hero-symbol">♙</span>
          <span className="students-hero-note note-one">♪</span>
          <span className="students-hero-note note-two">♫</span>
          <span className="students-hero-note note-three">♬</span>
        </div>
      </section>

      {/* Statistics cards */}
      <section className="students-stats">
        <article className="students-stat-card stat-students-blue">
          <div className="students-stat-icon">♙</div>
          <div>
            <p>Total de estudiantes</p>
            <h2>{students.length}</h2>
            <small>Estudiantes registrados</small>
          </div>
        </article>

        <article className="students-stat-card stat-students-green">
          <div className="students-stat-icon">✓</div>
          <div>
            <p>Resultados encontrados</p>
            <h2>{filteredStudents.length}</h2>
            <small>Coincidencias de búsqueda</small>
          </div>
        </article>

        <article className="students-stat-card stat-students-purple">
          <div className="students-stat-icon">✎</div>
          <div>
            <p>Gestión de estudiantes</p>
            <h2>CRUD</h2>
            <small>Registro y actualización</small>
          </div>
        </article>
      </section>

      {/* Feedback messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Main students panel */}
      <section className="students-panel">
        <div className="students-panel-heading">
          <div className="students-panel-title">
            <div className="students-list-icon">☷</div>
            <div>
              <h2>Directorio de estudiantes</h2>
              <p>Consulta, registra y actualiza estudiantes.</p>
            </div>
          </div>

          <button
            className="students-primary-button"
            onClick={() => {
              resetForm();
              setError("");
              setSuccess("");
              setShowForm(true);
            }}
          >
            <span>+</span> Nuevo estudiante
          </button>
        </div>

        {/* Student registration and editing form */}
        {showForm && (
          <form className="students-form" onSubmit={handleSubmit}>
            <h3>
              {editingId
                ? "Actualizar estudiante"
                : "Registrar estudiante"}
            </h3>

            <div className="students-form-grid">
              <div className="students-form-field">
                <label htmlFor="student-code">
                  Código del estudiante
                </label>
                <input
                  id="student-code"
                  name="student_code"
                  value={form.student_code}
                  onChange={handleChange}
                  placeholder="Ej. EST-006"
                  maxLength={30}
                  required
                />
              </div>

              <div className="students-form-field">
                <label htmlFor="student-name">
                  Nombre completo
                </label>
                <input
                  id="student-name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Nombre y apellidos"
                  maxLength={150}
                  required
                />
              </div>

              <div className="students-form-field">
                <label htmlFor="student-email">
                  Correo electrónico
                </label>
                <input
                  id="student-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="estudiante@correo.com"
                  maxLength={150}
                  required
                />
              </div>
            </div>

            <div className="students-form-actions">
              <button
                type="button"
                className="students-cancel-button"
                onClick={resetForm}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="students-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Actualizar estudiante"
                    : "Guardar estudiante"}
              </button>
            </div>
          </form>
        )}

        {/* Search toolbar */}
        <div className="students-toolbar">
          <div className="students-search">
            <span>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por código, nombre o correo electrónico..."
              aria-label="Buscar estudiantes"
            />
          </div>

          <div className="students-filter">
            <span>Estudiantes:</span>
            <strong>{filteredStudents.length} encontrados</strong>
          </div>
        </div>

        {/* Students table */}
        {loading ? (
          <p className="loading-message">
            Cargando estudiantes...
          </p>
        ) : (
          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre completo</th>
                  <th>Correo electrónico</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="students-empty">
                      No se encontraron estudiantes.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>
                        <span className="students-code">
                          {student.student_code}
                        </span>
                      </td>

                      <td>
                        <div className="students-person">
                          <div
                            className={`students-avatar avatar-color-${index % 5}`}
                          >
                            {getInitials(student.full_name || "ES")}
                          </div>
                          <span>{student.full_name}</span>
                        </div>
                      </td>

                      <td>
                        <div className="students-email">
                          <span>✉</span>
                          {student.email}
                        </div>
                      </td>

                      <td>
                        <button
                          className="students-action-button"
                          onClick={() => handleEdit(student)}
                          title="Editar estudiante"
                          aria-label={`Editar ${student.full_name}`}
                        >
                          ✎
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="students-panel-footer">
          Mostrando {filteredStudents.length} de {students.length} estudiantes
        </div>
      </section>
    </div>
  );
}

export default Students;
