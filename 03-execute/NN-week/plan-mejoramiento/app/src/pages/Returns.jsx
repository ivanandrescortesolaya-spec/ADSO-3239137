
import { useEffect, useState } from "react";
import { getLoans } from "../services/loanService";
import { createReturn } from "../services/returnService";

function Returns() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // Cargar prestamos
  const loadLoans = async () => {
    try {
      setError("");

      const response = await getLoans();
      setLoans(response.data ?? []);
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar los prestamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

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

  // Registrar devolucion
  const handleReturn = async (loan) => {
    const confirmed = window.confirm(
      `¿Confirmas la devolucion del instrumento ${loan.instrument_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      setProcessingId(loan.id);

      const response = await createReturn(loan.id);

      setSuccess(
        response.message || "Devolucion registrada correctamente."
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
          data?.message || "No fue posible registrar la devolucion."
        );
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Prestamos pendientes
  const pendingLoans = loans.filter(
    (loan) => !loan.return_record
  );

  // Buscar prestamos
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
    <>
      <div className="page-heading">
        <h1>Devoluciones</h1>
        <p>
          Administra las devoluciones de instrumentos musicales.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Prestamos pendientes</h2>
            <p>
              Registra la devolucion de los instrumentos prestados.
            </p>
          </div>

          <span className="loan-counter">
            {pendingLoans.length} pendientes
          </span>
        </div>

        <div className="form-field student-search">
          <label htmlFor="return-search">
            Buscar prestamo
          </label>

          <input
            id="return-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por estudiante o instrumento..."
          />
        </div>

        {loading ? (
          <p className="loading-message">
            Cargando prestamos pendientes...
          </p>
        ) : (
          <div className="table-container">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Instrumento</th>
                  <th>Fecha prestamo</th>
                  <th>Fecha vencimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      No hay prestamos pendientes para mostrar.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((loan) => (
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
                        <button
                          className="primary-button"
                          disabled={processingId === loan.id}
                          onClick={() => handleReturn(loan)}
                        >
                          {processingId === loan.id
                            ? "Procesando..."
                            : "Registrar devolucion"}
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

export default Returns;
