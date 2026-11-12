
import { useEffect, useMemo, useState } from "react";
import {
  getLoans,
  createLoan,
  getOverdueLoans,
} from "../services/loanService";
import { getStudents } from "../services/studentService";
import { getInstruments } from "../services/instrumentService";
import "./Loans.css";

function Loans() {
  const [loans, setLoans] = useState([]);
  const [students, setStudents] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const [form, setForm] = useState({
    student_id: "",
    instrument_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load loans, students, and instruments
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
      setError("No fue posible cargar la informacion de prestamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update form fields
  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  // Record a loan
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
        response.message || "Prestamo registrado correctamente."
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
          data?.message || "No fue posible registrar el prestamo."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Fetch overdue loans
  const handleOverdue = async () => {
    try {
      setError("");
      setShowOverdue(true);
      setLoading(true);

      const response = await getOverdueLoans();
      setLoans(response.data ?? []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError("No fue posible consultar los prestamos vencidos.");
    } finally {
      setLoading(false);
    }
  };

  // Return to the full list
  const handleAllLoans = async () => {
    setShowOverdue(false);
    setCurrentPage(1);
    await loadData();
  };

  // Cancel the form
  const resetForm = () => {
    setForm({
      student_id: "",
      instrument_id: "",
    });
    setShowForm(false);
  };

  // Format dates
  const formatDate = (date) => {
    if (!date) return "No disponible";

    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  // Determine the loan status
  const getLoanStatus = (loan) => {
    if (loan.return_record) return "Devuelto";

    if (new Date(loan.due_at) < new Date()) return "Vencido";

    return "Pendiente";
  };

  // Get the status style
  const getStatusClass = (status) => {
    if (status === "Devuelto") return "loan-status returned";
    if (status === "Vencido") return "loan-status overdue";
    return "loan-status pending";
  };

  // Available instruments
  const availableInstruments = instruments.filter(
    (instrument) =>
      instrument.is_active !== false &&
      instrument.available_units > 0
  );

  // Calculate loan summary
  const summary = useMemo(() => {
    const returned = loans.filter(
      (loan) => getLoanStatus(loan) === "Devuelto"
    ).length;

    const overdue = loans.filter(
      (loan) => getLoanStatus(loan) === "Vencido"
    ).length;

    const pending = loans.filter(
      (loan) => getLoanStatus(loan) === "Pendiente"
    ).length;

    return {
      total: loans.length,
      returned,
      overdue,
      pending,
    };
  }, [loans]);

  // Filter loans by search text and date range
  const filteredLoans = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return loans.filter((loan) => {
      const matchesSearch = [
        loan.student_name,
        loan.student_code,
        loan.instrument_name,
        loan.instrument_code,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchText)
      );

      const loanDate = loan.loaned_at
        ? new Date(loan.loaned_at).toISOString().slice(0, 10)
        : "";

      const matchesStartDate =
        !startDate || (loanDate && loanDate >= startDate);

      const matchesEndDate =
        !endDate || (loanDate && loanDate <= endDate);

      return matchesSearch && matchesStartDate && matchesEndDate;
    });
  }, [loans, search, startDate, endDate]);

  // Calculate pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredLoans.length / itemsPerPage)
  );

  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDateChange = (setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="loans-page">
      <div className="loans-hero">
        <div className="loans-hero-content">
          <span className="loans-hero-label">GESTIÓN DE PRÉSTAMOS</span>
          <h1>Préstamos</h1>
          <p>
            Administra los préstamos de instrumentos musicales,
            consulta su estado y controla los vencimientos.
          </p>
        </div>

        <div className="loans-hero-decoration" aria-hidden="true">
          <span>♫</span>
          <span>♬</span>
          <span>🎸</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="loans-stats-grid">
        <article className="loan-stat-card blue">
          <div className="loan-stat-icon">▣</div>
          <div>
            <span>Total de préstamos</span>
            <strong>{summary.total}</strong>
            <small>Registrados en el sistema</small>
          </div>
        </article>

        <article className="loan-stat-card green">
          <div className="loan-stat-icon">✓</div>
          <div>
            <span>Devueltos</span>
            <strong>{summary.returned}</strong>
            <small>Instrumentos regresados</small>
          </div>
        </article>

        <article className="loan-stat-card orange">
          <div className="loan-stat-icon">◷</div>
          <div>
            <span>En curso</span>
            <strong>{summary.pending}</strong>
            <small>Préstamos pendientes</small>
          </div>
        </article>

        <article className="loan-stat-card red">
          <div className="loan-stat-icon">!</div>
          <div>
            <span>Vencidos</span>
            <strong>{summary.overdue}</strong>
            <small>Fuera de la fecha límite</small>
          </div>
        </article>
      </div>

      <section className="loans-panel">
        <div className="loans-panel-heading">
          <div className="loans-panel-title">
            <div className="loans-list-icon">☷</div>
            <div>
              <h2>
                {showOverdue
                  ? "Listado de préstamos vencidos"
                  : "Listado de préstamos"}
              </h2>
              <p>Consulta y registra los préstamos de instrumentos.</p>
            </div>
          </div>

          <div className="loans-actions">
            <button
              className="loans-filter-button"
              onClick={showOverdue ? handleAllLoans : handleOverdue}
              type="button"
            >
              {showOverdue ? "Ver todos" : "Ver vencidos"}
            </button>

            {!showOverdue && (
              <button
                className="loans-primary-button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setShowForm(!showForm);
                }}
                type="button"
              >
                + Nuevo préstamo
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form className="loans-form" onSubmit={handleSubmit}>
            <h3>Registrar préstamo</h3>

            <div className="loans-form-grid">
              <div className="form-field">
                <label htmlFor="loan-student">Estudiante</label>
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
                <label htmlFor="loan-instrument">Instrumento</label>
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

            <div className="loans-form-actions">
              <button
                type="button"
                className="loans-filter-button"
                onClick={resetForm}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="loans-primary-button"
                disabled={saving || availableInstruments.length === 0}
              >
                {saving ? "Registrando..." : "Registrar préstamo"}
              </button>
            </div>
          </form>
        )}

        <div className="loans-toolbar">
          <div className="loans-search">
            <span>⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar por estudiante, instrumento o código..."
              aria-label="Buscar préstamos"
            />
          </div>

          <div className="loans-date-filters">
            <span>Filtrar por fecha:</span>
            <input
              type="date"
              value={startDate}
              onChange={handleDateChange(setStartDate)}
              aria-label="Fecha inicial"
            />
            <span className="date-separator">→</span>
            <input
              type="date"
              value={endDate}
              onChange={handleDateChange(setEndDate)}
              aria-label="Fecha final"
              min={startDate || undefined}
            />
          </div>
        </div>

        {loading ? (
          <p className="loading-message">Cargando préstamos...</p>
        ) : (
          <>
            <div className="table-container loans-table-container">
              <table className="inventory-table loans-table">
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
                  {paginatedLoans.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="loans-empty">
                        No se encontraron préstamos.
                      </td>
                    </tr>
                  ) : (
                    paginatedLoans.map((loan) => {
                      const status = getLoanStatus(loan);

                      return (
                        <tr key={loan.id}>
                          <td>
                            <div className="loan-person">
                              <div className="loan-avatar">
                                {(loan.student_name || "E")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <strong>{loan.student_name}</strong>
                                <small>{loan.student_code}</small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="loan-instrument">
                              <div className="loan-instrument-icon">♫</div>
                              <div>
                                <strong>{loan.instrument_name}</strong>
                                <small>{loan.instrument_code}</small>
                              </div>
                            </div>
                          </td>

                          <td>{formatDate(loan.loaned_at)}</td>
                          <td>{formatDate(loan.due_at)}</td>

                          <td>
                            <span className={getStatusClass(status)}>
                              {status === "Devuelto" && "✓ "}
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

            <div className="loans-pagination">
              <span>
                Mostrando {filteredLoans.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
                {" "}a{" "}
                {Math.min(currentPage * itemsPerPage, filteredLoans.length)}
                {" "}de {filteredLoans.length} préstamos
              </span>

              <div className="pagination-buttons">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  ‹
                </button>

                <span>
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Loans;
