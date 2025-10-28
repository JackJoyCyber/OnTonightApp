"use client";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function VenuesPage() {
  const { data, isLoading, error } = useSWR("/api/venues", fetcher);

  if (error) return <div className="p-6">Failed to load venues</div>;
  if (isLoading) return <div className="p-6">Loading venues...</div>;

  const venues = Array.isArray(data) ? data : [];

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore by Venue</h1>

      {venues.length === 0 ? (
        <div className="text-gray-400">
          No venues yet... head to{" "}
          <Link href="/workers" className="underline">People</Link> to browse Ari, Melanie, and Stephan.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((v: any) => (
            <Link
              key={v.id}
              href={`/venues/${v.slug}`}
              className="block bg-gray-900 rounded-2xl p-4 hover:shadow-lg"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl mb-3 bg-gray-800">
                <img
                  src={v.image || "/placeholder.jpg"}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold">{v.name}</h2>
              <p className="text-sm text-gray-400">{v.address}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
