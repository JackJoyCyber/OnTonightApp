export type Worker = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  saved?: boolean;
};

export type Venue = {
  id: string;
  slug: string;
  name: string;
  address: string;
  image: string;
  tonight: string;
  workers: string[];
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

export const workers: Worker[] = [
  { id: "w1", name: "Ava Carter", role: "Bartender", avatar: "/avatars/ava.jpg", saved: true },
  { id: "w2", name: "Marcus Lee", role: "Server", avatar: "/avatars/marcus.jpg" },
  { id: "w3", name: "Rae Kim", role: "DJ", avatar: "/avatars/rae.jpg", saved: true }
];

export const venues: Venue[] = [
  {
    id: "v1",
    slug: "white-oak-cottage",
    name: "White Oak Cottage",
    address: "123 Oak St, Tampa, FL",
    image: "/venues/whiteoak.jpg",
    tonight: "2025-10-27",
    workers: ["w1","w3"]
  },
  {
    id: "v2",
    slug: "tiki-docks",
    name: "Tiki Docks",
    address: "987 Beach Ave, Madeira Beach, FL",
    image: "/venues/tikidocks.jpg",
    tonight: "2025-10-27",
    workers: ["w2"]
  }
];

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Service Night",
    date: "2025-10-27",
    location: "White Oak Cottage",
    image: "/venues/whiteoak.jpg",
    description: "Tonight’s roster and vibes at White Oak",
    venueSlug: "white-oak-cottage"
  },
  {
    id: "e2",
    title: "Island Night",
    date: "2025-10-27",
    location: "Tiki Docks",
    image: "/venues/tikidocks.jpg",
    description: "Who’s on deck at Tiki Docks",
    venueSlug: "tiki-docks"
  }
];
