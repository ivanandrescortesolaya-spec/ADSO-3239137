
import { useCallback, useEffect, useRef, useState } from "react";
import { getInstruments } from "../services/instrumentService";
import { getStudents } from "../services/studentService";
import { getLoans, getOverdueLoans } from "../services/loanService";
import { getMostRequestedInstruments } from "../services/reportService";
import "./Dashboard.css";

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
  const [requestStatus, setRequestStatus] = useState({
    instruments: "loading",
    students: "loading",
    loans: "loading",
    overdue: "loading",
    report: "loading",
  });
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const availabilityPercentage =
    stats.totalUnits > 0
      ? Number(((stats.availableUnits / stats.totalUnits) * 100).toFixed(2))
      : 0;

  // Update each section as soon as its API response arrives.
  const loadDashboard = useCallback(() => {
    const currentRequest = ++requestId.current;
    const isCurrent = () => requestId.current === currentRequest;

    setError("");
    setRequestStatus({
      instruments: "loading",
      students: "loading",
      loans: "loading",
      overdue: "loading",
      report: "loading",
    });

    const loadSection = (key, fetchData, onSuccess) => {
      Promise.resolve()
        .then(fetchData)
        .then((response) => {
          if (!isCurrent()) return;
          onSuccess(getList(response));
          setRequestStatus((previous) => ({ ...previous, [key]: "done" }));
        })
        .catch((err) => {
          if (!isCurrent()) return;
          console.error(`Error loading dashboard ${key}:`, err);
          setRequestStatus((previous) => ({ ...previous, [key]: "error" }));
          setError("No fue posible cargar algunos indicadores. Verifica que la API esté funcionando.");
        });
    };

    loadSection("instruments", getInstruments, (instruments) => {
      const totalUnits = instruments.reduce(
        (total, item) => total + Number(item.total_units || 0),
        0
      );
      const availableUnits = instruments.reduce(
        (total, item) => total + Number(item.available_units || 0),
        0
      );
      setStats((previous) => ({
        ...previous,
        instruments: instruments.length,
        totalUnits,
        availableUnits,
      }));
    });

    loadSection("students", getStudents, (students) => {
      setStats((previous) => ({ ...previous, students: students.length }));
    });

    loadSection("loans", getLoans, (loans) => {
      const activeLoans = loans.filter(
        (loan) => !loan.return_record && !loan.returnRecord
      );
      setStats((previous) => ({ ...previous, activeLoans: activeLoans.length }));
    });

    loadSection("overdue", getOverdueLoans, (overdueLoans) => {
      setStats((previous) => ({ ...previous, overdueLoans: overdueLoans.length }));
    });

    loadSection("report", getMostRequestedInstruments, setPopularInstruments);
  }, []);

  useEffect(() => {
    loadDashboard();
    // Ignore responses from a previous mount or refresh.
    return () => {
      requestId.current += 1;
    };
  }, [loadDashboard]);

  const displayValue = (key, value) =>
    requestStatus[key] === "done"
      ? value
      : requestStatus[key] === "error"
        ? "—"
        : "...";

  const maxLoans = Math.max(
    1,
    ...popularInstruments.map((item) =>
      Number(item.total_loans ?? item.total_requests ?? 0)
    )
  );

  const cards = [
    {
      title: "Tipos de instrumentos",
      value: displayValue("instruments", stats.instruments),
      description: "Registrados en el catálogo",
      icon: "♫",
      illustration: "🎸",
      color: "blue",
    },
    {
      title: "Unidades disponibles",
      value: displayValue("instruments", stats.availableUnits),
      description: "Disponibles para préstamo",
      icon: "✓",
      illustration: "📦",
      color: "green",
    },
    {
      title: "Estudiantes",
      value: displayValue("students", stats.students),
      description: "Registrados en el sistema",
      icon: "♟",
      illustration: "👨‍🎓",
      color: "purple",
    },
    {
      title: "Préstamos activos",
      value: displayValue("loans", stats.activeLoans),
      description: "Instrumentos sin devolver",
      icon: "▣",
      illustration: "📋",
      color: "blue",
    },
    {
      title: "Préstamos vencidos",
      value: displayValue("overdue", stats.overdueLoans),
      description: "Requieren seguimiento",
      icon: "!",
      illustration: "📅",
      color: "orange",
    },
    {
      title: "Unidades totales",
      value: displayValue("instruments", stats.totalUnits),
      description: "En el inventario",
      icon: "▤",
      illustration: "📦",
      color: "purple",
    },
  ];

  return (
    <div className="dashboard-page">
      {error && (
        <div className="dashboard-error" role="alert">
          <span>!</span>
          <p>{error}</p>
          <button className="dashboard-retry" onClick={loadDashboard}>
            Reintentar
          </button>
        </div>
      )}
      {/* Main banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Bienvenido al sistema</span>
          <h1>Music School</h1>
          <p>Gestión de instrumentos, estudiantes y préstamos.</p>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <span className="hero-note">♫</span>
          <span className="hero-drum">🥁</span>
          <span className="hero-guitar">🎸</span>
          <span className="hero-piano">🎹</span>
        </div>
      </section>

      {/* Header */}
      <div className="dashboard-heading">
        <h2>Dashboard</h2>
        <p>Resumen general del sistema Music School.</p>
      </div>

      {/* Metrics */}
      <section className="dashboard-stats">
        {cards.slice(0, 4).map((card) => (
          <article
            className={`dashboard-stat-card ${card.color}`}
            key={card.title}
          >
            <span className="dashboard-stat-icon">{card.icon}</span>
            <div className="dashboard-stat-info">
              <p>{card.title}</p>
              <h3>{card.value}</h3>
              <small>{card.description}</small>
            </div>
            <span className="dashboard-illustration" aria-hidden="true">
              {card.illustration}
            </span>
          </article>
        ))}

        {cards.slice(4).map((card) => (
          <article
            className={`dashboard-stat-card ${card.color} secondary-stat`}
            key={card.title}
          >
            <span className="dashboard-stat-icon">{card.icon}</span>
            <div className="dashboard-stat-info">
              <p>{card.title}</p>
              <h3>{card.value}</h3>
              <small>{card.description}</small>
            </div>
            <span className="dashboard-illustration" aria-hidden="true">
              {card.illustration}
            </span>
          </article>
        ))}

        {/* Availability */}
        <article className="dashboard-stat-card availability-card">
          <span className="dashboard-stat-icon">%</span>
          <div className="dashboard-stat-info">
            <p>Disponibilidad del inventario</p>
            <h3>{displayValue("instruments", `${availabilityPercentage}%`)}</h3>

            <div
              className="availability-progress"
              role="progressbar"
              aria-label="Disponibilidad del inventario"
              aria-valuenow={requestStatus.instruments === "done" ? availabilityPercentage : 0}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="availability-progress-fill"
                style={{
                  width: requestStatus.instruments === "done" ? `${Math.min(100, availabilityPercentage)}%` : "0%",
                }}
              />
            </div>

            <small>Porcentaje de unidades disponibles</small>
          </div>
          <span className="dashboard-illustration" aria-hidden="true">
            ✓
          </span>
        </article>
      </section>

      {/* Most requested instruments */}
      <section className="dashboard-report">
        <div className="dashboard-report-heading">
          <div className="report-title">
            <span className="report-icon">▥</span>
            <div>
              <h2>Instrumentos más solicitados</h2>
              <p>Ranking basado en el historial de préstamos.</p>
            </div>
          </div>

          <button
            className="dashboard-refresh"
            onClick={loadDashboard}
          >
            <span>⟳</span> Actualizar
          </button>
        </div>

        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Posición</th>
                <th>Instrumento</th>
                <th>Total de préstamos</th>
                <th>Popularidad</th>
              </tr>
            </thead>

            <tbody>
              {requestStatus.report !== "done" ? (
                <tr>
                  <td colSpan="4" className="empty-report">
                    {requestStatus.report === "error"
                      ? "No fue posible cargar el reporte."
                      : "Cargando reporte..."}
                  </td>
                </tr>
              ) : popularInstruments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-report">
                    Todavía no hay datos para el reporte.
                  </td>
                </tr>
              ) : (
                popularInstruments.map((item, index) => {
                  const totalLoans = Number(
                    item.total_loans ?? item.total_requests ?? 0
                  );

                  const percentage = (totalLoans / maxLoans) * 100;

                  return (
                    <tr key={item.instrument_id ?? item.id ?? index}>
                      <td>
                        <span className={`ranking-position rank-${index + 1}`}>
                          {index === 0
                            ? "🥇"
                            : index === 1
                              ? "🥈"
                              : index === 2
                                ? "🥉"
                                : `#${index + 1}`}
                        </span>
                      </td>

                      <td className="instrument-name">
                        {item.instrument_name ??
                          item.name ??
                          "Instrumento sin nombre"}
                      </td>

                      <td className="loan-count">{totalLoans}</td>

                      <td>
                        <div className="ranking-progress">
                          <div
                            className="ranking-progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
