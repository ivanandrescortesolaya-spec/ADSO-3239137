
import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
} from "../services/studentService";

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

  // Consultar estudiantes
  const loadStudents = async () => {
    try {
      setError("");
      const response = await getStudents();
      setStudents(response.data ?? []);
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

  // Manejar cambios del formulario
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Limpiar formulario
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Registrar o actualizar estudiante
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

  // Preparar edicion
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

  // Buscar estudiantes
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.student_code?.toLowerCase().includes(searchText) ||
      student.full_name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText)
    );
  });

  return (
    <>
      <div className="page-heading">
        <h1>Estudiantes</h1>
        <p>Administra la informacion de los estudiantes registrados.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Listado de estudiantes</h2>
            <p>Consulta, registra y actualiza estudiantes.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              resetForm();
              setError("");
              setSuccess("");
              setShowForm(true);
            }}
          >
            + Nuevo estudiante
          </button>
        </div>

        {showForm && (
          <form className="instrument-form" onSubmit={handleSubmit}>
            <h3>
              {editingId ? "Actualizar estudiante" : "Registrar estudiante"}
            </h3>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="student-code">Codigo del estudiante</label>
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

              <div className="form-field">
                <label htmlFor="student-name">Nombre completo</label>
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

              <div className="form-field">
                <label htmlFor="student-email">Correo electronico</label>
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

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
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

        <div className="form-field student-search">
          <label htmlFor="student-search">Buscar estudiante</label>
          <input
            id="student-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por codigo, nombre o correo..."
          />
        </div>

        {loading ? (
          <p className="loading-message">Cargando estudiantes...</p>
        ) : (
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nombre completo</th>
                  <th>Correo electronico</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      No se encontraron estudiantes.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_code}</td>
                      <td>{student.full_name}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="secondary-button"
                          onClick={() => handleEdit(student)}
                        >
                          Editar
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

export default Students;
