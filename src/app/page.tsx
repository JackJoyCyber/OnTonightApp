"use client";
import useSWR from "swr";
import Link from "next/link";
import EventCard from "./components/EventCard";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HomePage() {
  const { data, isLoading } = useSWR("/api/events", fetcher);
  const events = Array.isArray(data) ? data : [];

  return (
    <main className="min-h-screen">
      <section className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2 text-center">Find what’s happening tonight</h1>
        <p className="text-center text-gray-400 mb-6">Browse by venue or by who’s on tonight</p>
        <div className="flex justify-center gap-3 mb-8">
          <Link href="/venues" className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700">Explore by Venue</Link>
          <Link href="/workers" className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-700">Explore by Person</Link>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-400">
            No events yet... try{" "}
            <Link href="/workers" className="underline">People</Link> to see Ari, Melanie, and Stephan.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event: any) => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>
    </main>
  );
}
