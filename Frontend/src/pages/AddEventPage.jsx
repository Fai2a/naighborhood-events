import React, { useEffect, useState } from "react";
import axios from "axios";

function AddEvent() {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  // Events & UI state
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Who is current user
  const currentUserName = localStorage.getItem("userName") || null;
  const currentUserId = localStorage.getItem("userId") || null;

  const API_BASE = "http://localhost/naighborhood-events/api";

  // Fetch events
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await axios.get(`${API_BASE}/getEvents.php`);
      let data = res.data;
      if (data && data.events) data = data.events;
      if (!Array.isArray(data)) data = Array.isArray(data.data) ? data.data : [];
      const normalized = data.map((ev) => ({
        id: ev.id ?? ev.event_id ?? ev.ID ?? null,
        title: ev.title ?? "",
        description: ev.description ?? "",
        date: ev.date ?? ev.event_date ?? "",
        location: ev.location ?? "",
        createdBy: ev.createdBy ?? ev.created_by ?? ev.createdByName ?? "",
        approved: ev.approved === "1" || ev.approved === 1 || ev.approved === true,
        raw: ev,
      }));
      setEvents(normalized);
    } catch (err) {
      console.error("Error fetching events:", err);
      showToast("Failed to load events", "error");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // Toast helper
  function showToast(text, type = "success", ms = 3000) {
    setToast({ text, type });
    setTimeout(() => setToast(null), ms);
  }

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date || !location.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        date,
        location: location.trim(),
        createdBy: currentUserId || currentUserName || "Unknown",
      };

      const res = await axios.post(`${API_BASE}/add_event.php`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data && (res.data.success || /added/i.test(res.data.message || ""))) {
        showToast(res.data.message || "Event added", "success");
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        fetchEvents();
      } else {
        showToast(res.data.message || "Failed to add event", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while adding event", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await axios.post(
        `${API_BASE}/deleteEvent.php`,
        { id },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && (res.data.success || /deleted/i.test(res.data.message || ""))) {
        showToast(res.data.message || "Event deleted", "success");
        setEvents((prev) => prev.filter((ev) => String(ev.id) !== String(id)));
      } else {
        showToast(res.data.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while deleting", "error");
    }
  };

  // Edit
  const openEdit = (event) => {
    if (!isOwner(event)) {
      showToast("You can only edit your own events", "error");
      return;
    }
    setEditingEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      createdBy: event.createdBy,
    });
  };

  const closeEdit = () => setEditingEvent(null);

  const handleEditSave = async () => {
    if (!editingEvent.title.trim() || !editingEvent.description.trim() || !editingEvent.date || !editingEvent.location.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }
    setEditLoading(true);
    try {
      const payload = { ...editingEvent };
      const res = await axios.post(`${API_BASE}/editEvent.php`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data && (res.data.success || /updated/i.test(res.data.message || ""))) {
        showToast(res.data.message || "Event updated", "success");
        fetchEvents();
        closeEdit();
      } else {
        showToast(res.data.message || "Failed to update", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error while updating", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const isOwner = (event) => {
    if (!event) return false;
    if (currentUserId && String(event.createdBy) === String(currentUserId)) return true;
    if (currentUserName && String(event.createdBy) === String(currentUserName)) return true;
    return false;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-green-900 to-black p-6 text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.text}
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-center text-green-400 mb-6 drop-shadow-lg">
        Add Event
      </h1>

      {/* Form */}
      <form
        onSubmit={handleAddEvent}
        className="max-w-lg mx-auto bg-black/40 backdrop-blur-md shadow-lg rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <textarea
          placeholder="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-3 border rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 border rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="w-full p-3 border rounded-lg bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Location</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
          <option value="Faisalabad">Faisalabad</option>
          <option value="Multan">Multan</option>
        </select>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full ${
            submitting ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } text-white py-3 rounded-lg font-semibold transition`}
        >
          {submitting ? "Adding..." : "Add Event"}
        </button>
      </form>

      {/* Events list */}
      <div className="mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-green-400 mb-4">All Events</h2>

        {loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-black/40 backdrop-blur-md shadow-xl rounded-xl p-5 border border-gray-700 transition transform hover:-translate-y-1 hover:shadow-green-500/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-green-400">{event.title}</h3>
                    <p className="text-gray-300 mt-2">{event.description}</p>
                    <p className="text-sm text-gray-400 mt-3">
                      📅 {event.date} • 📍 {event.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">👤 {event.createdBy}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        event.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Owner controls */}
                <div className="mt-4 flex gap-2">
                  {isOwner(event) ? (
                    <>
                      <button
                        onClick={() => openEdit(event)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button disabled className="bg-gray-600 text-gray-300 px-3 py-1 rounded">
                      View only
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-black/80 rounded-xl w-full max-w-md p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Edit Event</h3>

            <input
              type="text"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="w-full p-2 border rounded mb-3 bg-black/60 text-white focus:ring-2 focus:ring-green-400"
            />
            <textarea
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              className="w-full p-2 border rounded mb-3 bg-black/60 text-white focus:ring-2 focus:ring-green-400"
            />
            <input
              type="date"
              value={editingEvent.date}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              className="w-full p-2 border rounded mb-3 bg-black/60 text-white focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              value={editingEvent.location}
              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              className="w-full p-2 border rounded mb-3 bg-black/60 text-white focus:ring-2 focus:ring-green-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className={`px-4 py-2 rounded text-white ${
                  editLoading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
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

export default AddEvent;
