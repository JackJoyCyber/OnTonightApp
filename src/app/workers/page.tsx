"use client";
import { useEffect, useMemo, useState } from "react";

export default function WorkersPage() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);

  useEffect(() => {
    fetch("/api/workers").then(r => r.json()).then(setList);
  }, []);

  const filtered = useMemo(() => {
    const base = onlySaved ? list.filter(w => w.saved) : list;
    if (!q.trim()) return base;
    const needle = q.toLowerCase();
    return base.filter(w =>
      w.name.toLowerCase().includes(needle) ||
      w.role.toLowerCase().includes(needle)
    );
  }, [list, q, onlySaved]);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explore by Person</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search people by name or role"
          className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 w-72"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlySaved}
            onChange={e => setOnlySaved(e.target.checked)}
          />
          Show only Saved
        </label>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map(w => (
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
            {w.saved ? (
              <span className="inline-block text-xs mt-2 px-2 py-1 rounded bg-green-800/40">
                Saved
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </main>
  );
}
