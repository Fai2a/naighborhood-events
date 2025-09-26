// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = async () => {
    setSearched(true);
    try {
      const response = await axios.get(
        "http://localhost/naighborhood-events/Backend/events.php"
      );

      const query = search.toLowerCase();
      const results = response.data.filter((event) => {
        const city = event.city ? event.city.toLowerCase() : "";
        const area = event.area ? event.area.toLowerCase() : "";
        const location = event.location ? event.location.toLowerCase() : "";
        return (
          city.includes(query) ||
          area.includes(query) ||
          location.includes(query)
        );
      });

      setFilteredEvents(results);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",             // ✅ background full width
        backgroundColor: "#FFFFFF", // Clean white background
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#10B981", // Primary green
          color: "white",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "24px" }}>
          Neighborhood Events Hub
        </h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#F97316", // Accent orange
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "50px",
          color: "#1F2937", // Dark gray text for readability
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "20px",
              color: "#10B981", // Green heading
            }}
          >
            Welcome, {userName} 👋
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              maxWidth: "600px",
              marginBottom: "30px",
              color: "#374151", // Neutral text
            }}
          >
            Explore events, connect with your community, and enjoy all the
            features of the <strong>Neighborhood Events Hub</strong>.
          </p>

          {/* Search bar */}
          <div style={{ marginBottom: "20px", display: "flex" }}>
            <input
              type="text"
              placeholder="Search by city, area, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "2px solid #10B981",
                width: "300px",
                outline: "none",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "10px 20px",
                marginLeft: "10px",
                backgroundColor: "#3B82F6", // Secondary blue
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔍 Search
            </button>
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => navigate("/add-events")}
            style={{
              backgroundColor: "#F97316", // Accent orange
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            ➕ Add Event
          </button>
        </div>

        {/* Events in card form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {searched ? (
            filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: "#F9FAFB", // Light gray card bg
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3 style={{ color: "#10B981" }}>{event.title}</h3>
                  <p style={{ color: "#374151" }}>
                    📍 {event.city}, {event.area}, {event.location || "N/A"}
                  </p>
                  <p style={{ color: "#6B7280" }}>{event.description}</p>

                  {/* View Details Button */}
                  <Link
                    to={`/event/${event.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "8px 15px",
                      backgroundColor: "#3B82F6", // Secondary blue
                      borderRadius: "6px",
                      color: "white",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    🔍 View Details
                  </Link>
                </div>
              ))
            ) : (
              <p style={{ color: "#EF4444" }}>No events found.</p>
            )
          ) : (
            <p style={{ opacity: 0.7, color: "#6B7280" }}>
              🔍 Please search to see events.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
