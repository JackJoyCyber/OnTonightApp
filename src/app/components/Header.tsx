import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-black/60 backdrop-blur">
      <nav className="container mx-auto px-6 py-4 flex items-center gap-6">
        <Link href="/" className="font-bold">OnTonight</Link>
        <Link href="/venues" className="text-gray-300 hover:text-white">Explore by Venue</Link>
        <Link href="/workers" className="text-gray-300 hover:text-white">Explore by Person</Link>
      </nav>
    </header>
  );
}
