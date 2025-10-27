export default function EventCard({ event }: { event: any }) {
  return (
    <div className="bg-gray-900 rounded-2xl shadow p-4 hover:shadow-lg transition-all duration-200">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-3 bg-gray-800">
        <img src={event.image || "/placeholder.jpg"} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
      <p className="text-sm text-gray-400 mb-1">{event.date}</p>
      <p className="text-sm text-gray-400 mb-3">{event.location}</p>
      <p className="text-gray-300 text-sm line-clamp-3">{event.description}</p>
    </div>
  );
}
