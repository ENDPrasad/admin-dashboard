import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      const fetchReservations = async () => {
        const res = await axios.get(
          "https://restaurant-app-cmon.onrender.com/reserve",
          {
            headers: { "x-auth-token": token },
          }
        );
        setReservations(res.data);
      };
      fetchReservations();
    }
  }, [isAuthenticated, token]);

  const login = async () => {
    try {
      const res = await axios.post(
        "https://restaurant-app-cmon.onrender.com/admin/login",
        {
          username,
          password,
        }
      );
      setToken(res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setStatus("");
  };

  const updateStatus = async (id) => {
    await axios.put(
      `https://restaurant-app-cmon.onrender.com/reserve/${id}`,
      { status },
      {
        headers: { "x-auth-token": token },
      }
    );
    setStatus("");
    setSelectedReservation(null);
    const res = await axios.get(
      "https://restaurant-app-cmon.onrender.com/reserve",
      {
        headers: { "x-auth-token": token },
      }
    );
    setReservations(res.data);
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Panel</h1>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>No. of Persons</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} style={styles.tr}>
                <td style={styles.td}>{reservation.email}</td>
                <td style={styles.td}>{reservation.date}</td>
                <td style={styles.td}>{reservation.time}</td>
                <td style={styles.td}>{reservation.persons}</td>
                <td style={styles.td}>{reservation.status}</td>
                <td style={styles.td}>
                  <button
                    onClick={() => setSelectedReservation(reservation)}
                    style={styles.button}
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedReservation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h6 style={styles.subHeading}>
              Update Status for {selectedReservation.email}
            </h6>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.select}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div style={styles.modalActions}>
              <button
                onClick={() => updateStatus(selectedReservation._id)}
                style={styles.button}
              >
                Update
              </button>
              <button onClick={closeModal} style={styles.button}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  subHeading: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    margin: "5px",
  },
  tableContainer: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    marginBottom: "20px",
    borderCollapse: "collapse",
    minWidth: "600px",
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },
  tr: {
    "&:hover": {
      backgroundColor: "#f1f1f1",
    },
  },
  select: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    width: "100%",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
};

export default AdminPanel;
