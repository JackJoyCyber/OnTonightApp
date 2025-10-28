// src/lib/data.ts

export type Worker = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  saved?: boolean;
  bio?: string;
};

export type Venue = {
  id: string;
  slug: string;
  name: string;
  address: string;
  image: string;
  tonight: string;       // ISO date string
  workers: string[];     // worker ids
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  description?: string;
  venueSlug?: string;
};

// Keep your people
export const workers: Worker[] = [
  {
    id: "ari",
    name: "Ari",
    role: "Bartender",
    avatar: "/avatars/ari.jpg",
    saved: true,
    bio: "Crafts citrus-forward specials and dialed-in classics."
  },
  {
    id: "melanie",
    name: "Melanie",
    role: "Server",
    avatar: "/avatars/melanie.jpg",
    saved: true,
    bio: "Speed, smiles, and menu whisperer."
  },
  {
    id: "stephan",
    name: "Stephan",
    role: "DJ",
    avatar: "/avatars/stephan.jpg",
    bio: "Upbeat house and throwback sets... reads the room fast."
  }
];

// Remove placeholder venues and events
export const venues: Venue[] = [];
export const events: EventItem[] = [];
