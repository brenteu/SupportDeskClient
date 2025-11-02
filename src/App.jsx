import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: 1,
      title: "Fetching Data from Accounting Application",
      user: "Mark Hughes",
      status: "Pending",
      priority: "High",
      category: "Billing",
    },
    {
      id: 2,
      title: "How can I change my Plan?",
      user: "Sarah Lee",
      status: "Open",
      priority: "Medium",
      category: "Account",
    },
    {
      id: 3,
      title: "Storage space for premium account upgrade",
      user: "Matt Silva",
      status: "In Progress",
      priority: "Low",
      category: "Support",
    },
  ];

  const details = {
    title: "Fetching Data from Accounting Application",
    user: "Mark Hughes",
    due: "in 1 day",
    messages: [
      { sender: "Matt", text: "Hi Mark, we're checking your issue now." },
      { sender: "Mark Hughes", text: "Okay, thank you for the update." },
      {
        sender: "Matt",
        text: "We’ll notify you once the integration is verified.",
      },
    ],
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Tickets</h2>
        <div className="menu-section">
          <h4>QUEUES</h4>
          <ul>
            <li className="active">Pending Tickets</li>
            <li>All Tickets</li>
            <li>My Tickets</li>
            <li>Resolved</li>
          </ul>
        </div>
        <div className="menu-section">
          <h4>STATUS</h4>
          <ul>
            <li>New</li>
            <li>Open</li>
            <li>Closed</li>
          </ul>
        </div>
      </aside>

      {/* Ticket List */}
      <section className="ticket-list">
        <div className="header">
          <input placeholder="Search Tickets" className="search" />
        </div>
        <h3>Pending Tickets</h3>
        {tickets.map((t) => (
          <div
            key={t.id}
            className={`ticket-card ${
              selectedTicket && selectedTicket.id === t.id ? "selected" : ""
            }`}
            onClick={() => setSelectedTicket(t)}
          >
            <div className="ticket-header">
              <div>
                <h4>{t.title}</h4>
                <p className="user">{t.user}</p>
              </div>
              <div className={`priority ${t.priority.toLowerCase()}`}>
                {t.priority}
              </div>
            </div>
            <div className="ticket-meta">
              <span className="status">{t.status}</span>
              <span className="category">{t.category}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Ticket Details */}
      <section className="ticket-detail">
        {selectedTicket ? (
          <>
            <div className="detail-header">
              <h3>{details.title}</h3>
              <span className="due">{details.due}</span>
            </div>
            <div className="messages">
              {details.messages.map((m, i) => (
                <div key={i} className="message">
                  <strong>{m.sender}:</strong> <span>{m.text}</span>
                </div>
              ))}
            </div>
            <div className="reply-box">
              <input placeholder="Write a reply..." />
              <button>Send</button>
            </div>
          </>
        ) : (
          <div className="empty">
            <p>Select a ticket to view details</p>
          </div>
        )}
      </section>
    </div>
  );
}
