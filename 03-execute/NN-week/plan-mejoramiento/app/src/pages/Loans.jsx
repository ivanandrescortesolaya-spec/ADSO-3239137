
import { useEffect, useState } from "react";
import { getLoans, createLoan, getOverdueLoans } from "../services/loanService";
import { getStudents } from "../services/studentService";
import { getInstruments } from "../services/instrumentService";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [students, setStudents] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);

  const [form, setForm] = useState({
    student_id: "",
    instrument_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar préstamos, estudiantes e instrumentos
  const loadData = async () => {
    try {
      setError("");

      const [loanResponse, studentResponse, instrumentResponse] =
        await Promise.all([
          getLoans(),
          getStudents(),
          getInstruments(),
        ]);

      setLoans(loanResponse.data ?? []);
      setStudents(studentResponse.data ?? []);
      setInstruments(instrumentResponse.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar la información de préstamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cambiar los campos del formulario
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Registrar préstamo
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.student_id || !form.instrument_id) {
      setError("Selecciona un estudiante y un instrumento.");
      return;
    }

    try {
      setSaving(true);

      const response = await createLoan({
        student_id: Number(form.student_id),
        instrument_id: Number(form.instrument_id),
      });

      setSuccess(
        response.message || "Préstamo registrado correctamente."
      );

      setForm({
        student_id: "",
        instrument_id: "",
      });

      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          data?.message || "No fue posible registrar el préstamo."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Consultar préstamos vencidos
  const handleOverdue = async () => {
    try {
      setError("");
      setShowOverdue(true);
      setLoading(true);

      const response = await getOverdueLoans();
      setLoans(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible consultar los préstamos vencidos.");
    } finally {
      setLoading(false);
    }
  };

  // Volver al listado general
  const handleAllLoans = async () => {
    setShowOverdue(false);
    await loadData();
  };

  // Cancelar formulario
  const resetForm = () => {
    setForm({
      student_id: "",
      instrument_id: "",
    });
    setShowForm(false);
  };

  // Formatear fechas
  const formatDate = (date) => {
    if (!date) return "No disponible";

    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  // Determinar el estado del préstamo
  const getLoanStatus = (loan) => {
    if (loan.return_record) return "Devuelto";

    if (new Date(loan.due_at) < new Date()) return "Vencido";

    return "Pendiente";
  };

  const getStatusClass = (status) => {
    if (status === "Devuelto") return "status-returned";
    if (status === "Vencido") return "status-overdue";
    return "status-pending";
  };

  // Instrumentos disponibles
  const availableInstruments = instruments.filter(
    (instrument) =>
      instrument.is_active !== false &&
      instrument.available_units > 0
  );

  return (
    <>
      <div className="page-heading">
        <h1>Préstamos</h1>
        <p>Administra los préstamos de instrumentos musicales.</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              {showOverdue
                ? "Préstamos vencidos"
                : "Listado de préstamos"}
            </h2>
            <p>
              Consulta y registra los préstamos de instrumentos.
            </p>
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={showOverdue ? handleAllLoans : handleOverdue}
            >
              {showOverdue
                ? "Ver todos"
                : "Ver vencidos"}
            </button>

            {!showOverdue && (
              <button
                className="primary-button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setShowForm(!showForm);
                }}
              >
                + Nuevo préstamo
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form className="instrument-form" onSubmit={handleSubmit}>
            <h3>Registrar préstamo</h3>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="loan-student">
                  Estudiante
                </label>

                <select
                  id="loan-student"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un estudiante</option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.student_code} - {student.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="loan-instrument">
                  Instrumento
                </label>

                <select
                  id="loan-instrument"
                  name="instrument_id"
                  value={form.instrument_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un instrumento</option>

                  {availableInstruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.code} - {instrument.name}
                      {" "}({instrument.available_units} disponibles)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {availableInstruments.length === 0 && (
              <p className="error-message">
                No hay instrumentos disponibles para prestar.
              </p>
            )}

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
                disabled={
                  saving || availableInstruments.length === 0
                }
              >
                {saving ? "Registrando..." : "Registrar préstamo"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="loading-message">
            Cargando préstamos...
          </p>
        ) : (
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Instrumento</th>
                  <th>Fecha préstamo</th>
                  <th>Fecha vencimiento</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No hay préstamos para mostrar.
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => {
                    const status = getLoanStatus(loan);

                    return (
                      <tr key={loan.id}>
                        <td>
                          {loan.student_name}
                          <br />
                          <small>{loan.student_code}</small>
                        </td>

                        <td>
                          {loan.instrument_name}
                          <br />
                          <small>{loan.instrument_code}</small>
                        </td>

                        <td>{formatDate(loan.loaned_at)}</td>
                        <td>{formatDate(loan.due_at)}</td>

                        <td>
                          <span className={getStatusClass(status)}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default Loans;
