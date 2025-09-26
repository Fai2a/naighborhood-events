import React, { useEffect, useState } from "react";

function EventList() {
  const [events, setEvents] = useState([]);

  // Fetch events
  useEffect(() => {
    fetch("http://localhost/naighborhood-events/api/getEvents.php")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch("http://localhost/naighborhood-events/api/deleteEvent.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">All Events</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              📍 {event.location} | 📅 {event.date}
            </p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => alert("Edit feature coming soon!")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
