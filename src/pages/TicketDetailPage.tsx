import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import "../styles/layout.css";
import "../styles/tickets.css";

type Ticket = {
  id: number;
  title: string;
  description: string;
  status: "New" | "Open" | "Pending" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedToUserId?: string | null;
};

type Message = {
  id: number;
  body: string;
  createdAt: string;
  isInternalNote: boolean;
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isStaff = !!user?.roles?.some((r) => r === "Agent" || r === "Admin");

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");

  const isClosed = ticket?.status === "Closed";
  const canSend = !isClosed || isStaff; // customer blocked when closed

  async function load() {
    setErr("");
    const t = await api<Ticket>(`/api/tickets/${id}`);
    const m = await api<Message[]>(`/api/tickets/${id}/messages`);
    setTicket(t);
    setMessages(m);
  }

  useEffect(() => {
    load().catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function sendMessage() {
    if (!body.trim()) return;
    if (!canSend) return;
    await api(`/api/tickets/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ body, isInternalNote: false }),
    });
    setBody("");
    await load();
  }

  async function updateStatus(status: Ticket["status"]) {
    if (!ticket) return;
    await api(`/api/tickets/${ticket.id}`, {
      method: "PUT",
      body: JSON.stringify({
        status,
        assignedToUserId: ticket.assignedToUserId ?? null,
        priority: ticket.priority,
      }),
    });
    await load();
  }

  if (err) return <p className="error">{err}</p>;
  if (!ticket) return <p className="small">Loading...</p>;

  return (
    <div className="card">
      <h2 className="h2">Ticket #{ticket.id}</h2>
      <h3>{ticket.title}</h3>
      <p className="small">{ticket.description}</p>

      <div className="actions">
        <span className="small">
          <strong>Status:</strong> {ticket.status}
        </span>

        {isStaff && (
          <>
            <button type="button" onClick={() => updateStatus("Open")}>Open</button>
            <button type="button" onClick={() => updateStatus("Pending")}>Pending</button>
            <button type="button" onClick={() => updateStatus("Resolved")}>Resolved</button>
            <button type="button" onClick={() => updateStatus("Closed")}>Closed</button>
          </>
        )}
      </div>

      <hr />

      <h3>Messages</h3>
      <ul className="thread">
        {messages.map((m) => (
          <li key={m.id} className="threadItem">
            <div>{m.body}</div>
            <div className="threadMeta">{new Date(m.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>

      <div className="form formWide">
        <label htmlFor="replyBody" className="small">
          Reply
        </label>
        <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
                canSend
                ? "Write a reply..."
                : "This ticket is closed. Messaging is disabled."
            }
            disabled={!canSend}
        />

        <button
            type="button"
            onClick={sendMessage}
            disabled={!canSend}
        >
            Send
        </button>
      </div>
      {!canSend && (
        <p className="small muted">
            This ticket is closed. Only staff can add notes.
        </p>
        )}
    </div>
  );
}
