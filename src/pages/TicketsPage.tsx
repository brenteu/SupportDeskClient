import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/http";
import "../styles/layout.css";
import "../styles/tickets.css";

type Ticket = {
  id: number;
  title: string;
  status: "New" | "Open" | "Pending" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  updatedAt: string;
};

function badgeClass(base: string, value: string) {
  return `${base} ${base}--${value.toLowerCase()}`;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [status, setStatus] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function load() {
    setErr("");
    const qs = status ? `?status=${encodeURIComponent(status)}` : "";
    const data = await api<Ticket[]>(`/api/tickets${qs}`);
    setTickets(data);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="card">
      <h2 className="h2">Tickets</h2>

      <div className="filters">
        <label htmlFor="statusFilter" className="small">Status</label>
        <select
          id="statusFilter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">(All)</option>
          <option value="New">New</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <button type="button" onClick={() => load().catch((e) => setErr(e.message))}>
          Refresh
        </button>
      </div>

      {err && <p className="error">{err}</p>}

      <ul className="ticketList">
        {tickets.map((t) => (
          <li key={t.id} className="ticketRow">
            <Link className="ticketLink" to={`/tickets/${t.id}`}>
              <span className="ticketTitle">#{t.id} {t.title}</span>

              <span className="ticketMeta">
                <span className={badgeClass("badge", t.priority)}>{t.priority}</span>
                <span className={badgeClass("badge status", t.status)}>{t.status}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
