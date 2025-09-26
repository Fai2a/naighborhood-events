import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost/naighborhood-events/Backend/getEventById.php?id=${id}`)
      .then((res) => {
        console.log("API Response:", res.data);
        setEvent(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading event details...
      </p>
    );
  }

  if (event.error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {event.error}
      </p>
    );
  }

  // ✅ Correct status mapping from "approved" column
  const getStatusText = () => {
    const approved = parseInt(event.approved); // backend se approved field aa rahi hai
    if (approved === 1) return "✅ Approved";
    if (approved === 0) return "❌ Rejected";
    return "⏳ Pending";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
          <h1 className="text-3xl font-extrabold">{event.title}</h1>
          <p className="text-gray-100 mt-1">Community Event</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300">
            {event.description || "No description available."}
          </p>

          <p>
            📅 <strong>{event.event_date || "Date not provided"}</strong>
          </p>
          <p>
            📍 <strong>{event.location || "Location not provided"}</strong>
          </p>
          <p>
            👤 Created By: {event.createdBy || "Unknown"}
          </p>

          <p className="mt-2 font-semibold">
            Status: {getStatusText()}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg shadow"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
