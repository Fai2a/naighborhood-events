import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost/naighborhood-events/api/getEvents.php"
      );
      let data = res.data;
      if (data && data.events) data = data.events;
      if (!Array.isArray(data)) data = [];
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.post(
        "http://localhost/naighborhood-events/api/approveEvent.php",
        { id, status }
      );
      fetchEvents();
    } catch (err) {
      console.error("Error updating event", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.post(
        "http://localhost/naighborhood-events/api/deleteEvent.php",
        { id }
      );
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event", err);
    }
  };

  const openEdit = (event) => {
    setEditingEvent({ ...event });
  };

  const closeEdit = () => setEditingEvent(null);

  const handleEditSave = async () => {
    if (
      !editingEvent.title ||
      !editingEvent.description ||
      !editingEvent.date ||
      !editingEvent.location
    ) {
      alert("Please fill all fields");
      return;
    }
    setEditLoading(true);
    try {
      await axios.post(
        "http://localhost/naighborhood-events/api/editEvent.php",
        editingEvent
      );
      fetchEvents();
      closeEdit();
    } catch (err) {
      console.error("Error updating event", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-400 drop-shadow-lg">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-6 rounded-xl shadow-xl border border-gray-700 bg-gray-800 bg-opacity-80 backdrop-blur-md transition transform hover:-translate-y-1 hover:shadow-green-500/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-300">{event.description}</p>
                <p className="text-gray-400 mt-3">
                  📅 {event.event_date || event.date} | 📍 {event.location}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  👤 Created By: {event.createdBy}
                </p>
                <p className="mt-3 font-semibold">
                  {event.approved === 1
                    ? "✅ Approved"
                    : event.approved === 0
                    ? "⏳ Pending"
                    : ""}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus(event.id, "approved")}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  event.approved === 1
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={event.approved === 1}
              >
                Approve
              </button>

              {/* <button
                onClick={() => updateStatus(event.id, "rejected")}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  event.approved === -1
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={event.approved === -1}
              >
                Reject
              </button> */}

              <button
                onClick={() => openEdit(event)}
                className="px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-4">
              Edit Event
            </h3>

            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 bg-gray-800 text-white focus:ring-2 focus:ring-green-400"
            />
            <textarea
              value={editingEvent.description}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 bg-gray-800 text-white focus:ring-2 focus:ring-green-400"
            />
            <input
              type="date"
              value={editingEvent.date}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, date: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 bg-gray-800 text-white focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              value={editingEvent.location}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, location: e.target.value })
              }
              className="w-full p-2 border rounded mb-3 bg-gray-800 text-white focus:ring-2 focus:ring-green-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className={`px-4 py-2 rounded text-white ${
                  editLoading
                    ? "bg-gray-500"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
