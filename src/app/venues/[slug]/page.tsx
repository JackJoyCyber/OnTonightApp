import { venues, workers } from "@/lib/data";

export default function VenueDetail({ params }: { params: { slug: string } }) {
  const venue = venues.find(v => v.slug === params.slug);
  if (!venue) return <div className="p-6">Venue not found</div>;

  const roster = workers.filter(w => venue.workers.includes(w.id));

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6">
        <div className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-2xl bg-gray-800">
          <img
            src={venue.image || "/placeholder.jpg"}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold mt-4">{venue.name}</h1>
        <p className="text-gray-400">{venue.address}</p>
        <p className="text-gray-300 mt-2">Who’s on tonight: {venue.tonight}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Tonight’s roster</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {roster.map(w => (
          <div key={w.id} className="bg-gray-900 rounded-2xl p-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-800">
              <img
                src={w.avatar || "/placeholder.jpg"}
                alt={w.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mt-3">{w.name}</h3>
            <p className="text-gray-400 text-sm">{w.role}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
