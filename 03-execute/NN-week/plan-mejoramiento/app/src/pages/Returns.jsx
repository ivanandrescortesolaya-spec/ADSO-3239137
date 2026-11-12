
import { useEffect, useState } from "react";
import "./Returns.css";
import { getLoans } from "../services/loanService";
import { createReturn } from "../services/returnService";

function Returns() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Load all loans from the API
  const loadLoans = async () => {
    try {
      setError("");

      const response = await getLoans();
      setLoans(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar los préstamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  // Format dates for display
  const formatDate = (date) => {
    if (!date) return "No disponible";

    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  // Check whether a loan is overdue
  const isOverdue = (date) => {
    if (!date) return false;

    const dueDate = new Date(date);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  // Register an instrument return
  const handleReturn = async (loan) => {
    const confirmed = window.confirm(
      `¿Confirmas la devolución del instrumento ${loan.instrument_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      setProcessingId(loan.id);

      const response = await createReturn(loan.id);

      setSuccess(
        response.message || "Devolución registrada correctamente."
      );

      await loadLoans();
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Revisa los datos ingresados.");
      } else {
        setError(
          data?.message || "No fue posible registrar la devolución."
        );
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Separate pending and returned loans
  const pendingLoans = loans.filter((loan) => !loan.return_record);
  const returnedLoans = loans.filter((loan) => loan.return_record);

  // Calculate overdue pending loans
  const overdueLoans = pendingLoans.filter((loan) =>
    isOverdue(loan.due_at)
  );

  // Filter pending loans by student or instrument
  const filteredLoans = pendingLoans.filter((loan) => {
    const searchText = search.toLowerCase();

    return (
      loan.student_name?.toLowerCase().includes(searchText) ||
      loan.student_code?.toLowerCase().includes(searchText) ||
      loan.instrument_name?.toLowerCase().includes(searchText) ||
      loan.instrument_code?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="returns-page">
      <section className="returns-hero">
        <div className="returns-hero-content">
          <span className="returns-hero-label">
            GESTIÓN DE DEVOLUCIONES
          </span>

          <h1>Devoluciones</h1>

          <p>
            Administra las devoluciones de instrumentos musicales,
            <br className="returns-desktop-break" />
            registra el retorno y lleva el control de los préstamos pendientes.
          </p>
        </div>

        <div className="returns-hero-decoration" aria-hidden="true">
          <span className="returns-music-note note-one">♫</span>
          <span className="returns-music-note note-two">♫</span>
          <span className="returns-music-note note-three">♪</span>
          <span className="returns-back-arrow">↶</span>
          <span className="returns-guitar">🎸</span>
          <span className="returns-box">📦</span>
        </div>
      </section>

      {error && <div className="returns-alert error-message">{error}</div>}
      {success && <div className="returns-alert success-message">{success}</div>}

      <section className="returns-stats">
        <article className="returns-stat-card pending-stat">
          <div className="returns-stat-icon">▰</div>

          <div className="returns-stat-info">
            <span>Préstamos pendientes</span>
            <strong>{pendingLoans.length}</strong>
            <small>Instrumentos por devolver</small>
          </div>

          <span className="returns-stat-decoration">▥</span>
        </article>

        <article className="returns-stat-card returned-stat">
          <div className="returns-stat-icon">✓</div>

          <div className="returns-stat-info">
            <span>Devueltos</span>
            <strong>{returnedLoans.length}</strong>
            <small>Registrados en el sistema</small>
          </div>

          <span className="returns-stat-decoration">▥</span>
        </article>

        <article className="returns-stat-card total-stat">
          <div className="returns-stat-icon">▦</div>

          <div className="returns-stat-info">
            <span>Total de préstamos</span>
            <strong>{loans.length}</strong>
            <small>Préstamos gestionados</small>
          </div>

          <span className="returns-stat-decoration">▥</span>
        </article>
      </section>

      <section className="returns-panel">
        <div className="returns-panel-header">
          <div className="returns-panel-title">
            <div className="returns-panel-icon">↶</div>

            <div>
              <h2>Préstamos pendientes</h2>
              <p>Registra la devolución de los instrumentos prestados.</p>
            </div>
          </div>

          <span className="returns-counter">
            {pendingLoans.length} pendiente(s)
          </span>
        </div>

        <div className="returns-search-wrapper">
          <span className="returns-search-icon">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por estudiante o instrumento..."
            aria-label="Buscar préstamo"
          />
        </div>

        {loading ? (
          <p className="loading-message">
            Cargando préstamos pendientes...
          </p>
        ) : (
          <div className="returns-table-container">
            <table className="returns-table">
              <thead>
                <tr>
                  <th>ESTUDIANTE</th>
                  <th>INSTRUMENTO</th>
                  <th>FECHA PRÉSTAMO</th>
                  <th>FECHA VENCIMIENTO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="returns-empty">
                      {pendingLoans.length === 0
                        ? "No hay préstamos pendientes de devolución."
                        : "No se encontraron préstamos."}
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id}>
                      <td>
                        <div className="returns-person-cell">
                          <div className="returns-avatar">
                            {loan.student_name?.charAt(0)?.toUpperCase() || "E"}
                          </div>

                          <div>
                            <strong>{loan.student_name}</strong>
                            <small>{loan.student_code}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="returns-instrument-cell">
                          <div className="returns-instrument-icon">🎸</div>

                          <div>
                            <strong>{loan.instrument_name}</strong>
                            <small>{loan.instrument_code}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="returns-date-cell">
                          <span>▦</span>
                          {formatDate(loan.loaned_at)}
                        </div>
                      </td>

                      <td>
                        <div className="returns-date-cell">
                          <span>▦</span>
                          {formatDate(loan.due_at)}
                          {isOverdue(loan.due_at) && (
                            <small className="returns-overdue-tag">
                              Vencido
                            </small>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          className="returns-action-button"
                          disabled={processingId === loan.id}
                          onClick={() => handleReturn(loan)}
                        >
                          {processingId === loan.id
                            ? "Procesando..."
                            : "↶  Registrar devolución"}
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

      {!loading && overdueLoans.length > 0 && (
        <p className="returns-overdue-notice">
          Hay {overdueLoans.length} préstamo(s) vencido(s) que requieren seguimiento.
        </p>
      )}
    </div>
  );
}

export default Returns;
