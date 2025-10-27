import Link from "next/link";
import { notFound } from "next/navigation";
import { venues, workers } from "@/lib/data";

type Params = { slug: string };

export default function VenueDetail({ params }: { params: Params }) {
  const venue = venues.find(v => v.slug === params.slug);
  if (!venue) return notFound();

  const roster = workers.filter(w => venue.workers.includes(w.id));

  return (
    <main className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-gray-400">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/venues" className="hover:underline">Venues</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{venue.name}</span>
      </nav>

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
      {roster.length === 0 ? (
        <p className="text-gray-400">No workers listed for tonight.</p>
      ) : (
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
              <div className="mt-3">
                <Link
                  href="/workers"
                  className="text-xs px-2 py-1 border border-gray-700 rounded hover:bg-gray-800"
                >
                  View all people
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
