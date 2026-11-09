
import { useEffect, useState } from "react";
import { getInstruments } from "../services/instrumentService";
import { getStudents } from "../services/studentService";
import { getLoans, getOverdueLoans } from "../services/loanService";
import { getMostRequestedInstruments } from "../services/reportService";

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.datos)) return response.datos;
  return [];
}

function Dashboard() {
  const [stats, setStats] = useState({
    instruments: 0,
    students: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalUnits: 0,
    availableUnits: 0,
  });

  const [popularInstruments, setPopularInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Calcular porcentaje de disponibilidad
  const availabilityPercentage =
  stats.totalUnits > 0
     ? Number(
    ((stats.availableUnits / stats.totalUnits) * 100).toFixed(2)
        )
        : 0;

  const loadDashboard = async () => {
    try {
      setError("");

      const [
        instrumentResponse,
        studentResponse,
        loanResponse,
        overdueResponse,
        reportResponse,
      ] = await Promise.all([
        getInstruments(),
        getStudents(),
        getLoans(),
        getOverdueLoans(),
        getMostRequestedInstruments(),
      ]);

      const instruments = getList(instrumentResponse);
      const students = getList(studentResponse);
      const loans = getList(loanResponse);
      const overdueLoans = getList(overdueResponse);
      const report = getList(reportResponse);

      const activeLoans = loans.filter(
        (loan) => !loan.return_record && !loan.returnRecord
      );

      const totalUnits = instruments.reduce(
        (total, item) => total + Number(item.total_units || 0),
        0
      );

      const availableUnits = instruments.reduce(
        (total, item) => total + Number(item.available_units || 0),
        0
      );

      setStats({
        instruments: instruments.length,
        students: students.length,
        activeLoans: activeLoans.length,
        overdueLoans: overdueLoans.length,
        totalUnits,
        availableUnits,
      });

      setPopularInstruments(report);
    } catch (err) {
      console.error("Error al cargar el Dashboard:", err);
      setError(
        "No fue posible cargar todos los indicadores. Verifica que la API esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Resumen general del sistema Music School.</p>
      </div>

      {loading ? (
        <p className="loading-message">Cargando indicadores...</p>
      ) : error ? (
        <div className="error-message">
          {error}
          <button
            className="secondary-button"
            onClick={loadDashboard}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon blue">♫</span>
              <p>Tipos de instrumentos</p>
              <h2>{stats.instruments}</h2>
              <small>Registrados en el catálogo</small>
              
            </div>

            <div className="stat-card">
              <span className="stat-icon green">✓</span>
              <p>Unidades disponibles</p>
              <h2>{stats.availableUnits}</h2>
              <small>Disponibles para préstamo</small>
            </div>

            <div className="stat-card">
              <span className="stat-icon purple">♙</span>
              <p>Estudiantes</p>
              <h2>{stats.students}</h2>
              <small>Registrados en el sistema</small>
            </div>

            <div className="stat-card">
              <span className="stat-icon blue">▣</span>
              <p>Préstamos activos</p>
              <h2>{stats.activeLoans}</h2>
              <small>Instrumentos sin devolver</small>
            </div>

            <div className="stat-card">
              <span className="stat-icon orange">!</span>
              <p>Préstamos vencidos</p>
              <h2>{stats.overdueLoans}</h2>
              <small>Requieren seguimiento</small>
            </div>

            <div className="stat-card">
              <span className="stat-icon purple">▤</span>
              <p>Unidades totales</p>
              <h2>{stats.totalUnits}</h2>
              <small>En el inventario</small>
            </div>
            
            <div className="stat-card">
            <span className="stat-icon green">%</span>

            <p>Disponibilidad del inventario</p>

            <h2>{availabilityPercentage}%</h2>

            <div className="availability-progress">
                <div
                className="availability-progress-fill"
                style={{
                    width: `${availabilityPercentage}%`,
                }}
                />
            </div>

            <small>
                Porcentaje de unidades disponibles
            </small>
            </div>

          </div>

          <section className="panel dashboard-report">
            <div className="panel-heading">
              <div>
                <h2>Instrumentos más solicitados</h2>
                <p>
                  Ranking basado en el historial de préstamos.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={loadDashboard}
              >
                Actualizar
              </button>
            </div>

            <div className="table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Instrumento</th>
                    <th>Total de préstamos</th>
                  </tr>
                </thead>

                <tbody>
                  {popularInstruments.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        Todavía no hay datos para el reporte.
                      </td>
                    </tr>
                  ) : (
                    popularInstruments.map((item, index) => (
                      <tr key={item.instrument_id ?? item.id ?? index}>
                        <td>#{index + 1}</td>
                        <td>
                          {item.instrument_name ??
                            item.name ??
                            "Instrumento sin nombre"}
                        </td>
                        <td>
                          {item.total_loans ??
                            item.total_requests ??
                            0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Dashboard;
