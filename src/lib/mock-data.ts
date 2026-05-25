export type Role = "resident" | "transporter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  area?: string;
  avatar?: string;
}

export const mockUsers: Record<Role, User> = {
  resident: { id: "u1", name: "Made Ayu", email: "warga@route.id", role: "resident", area: "Ubud, Gianyar" },
  transporter: { id: "t1", name: "Wayan Sutha", email: "petugas@route.id", role: "transporter", area: "Zone A — Ubud" },
  admin: { id: "a1", name: "Putu Aditya", email: "admin@route.id", role: "admin" },
};

export type PickupStatus = "scheduled" | "on_the_way" | "arrived" | "picked_up" | "failed";

export const statusLabel: Record<PickupStatus, string> = {
  scheduled: "Scheduled",
  on_the_way: "On the way",
  arrived: "Arrived",
  picked_up: "Picked up",
  failed: "Failed",
};

export const mockSchedule = [
  { id: "s1", day: "Monday", date: "2026-05-25", time: "07:00", type: "Organic", status: "picked_up" as PickupStatus },
  { id: "s2", day: "Wednesday", date: "2026-05-27", time: "07:00", type: "Non-organic", status: "on_the_way" as PickupStatus },
  { id: "s3", day: "Friday", date: "2026-05-29", time: "07:00", type: "Organic", status: "scheduled" as PickupStatus },
  { id: "s4", day: "Saturday", date: "2026-05-30", time: "08:00", type: "Recyclable", status: "scheduled" as PickupStatus },
];

export const mockRequests = [
  { id: "r1", type: "Extra waste", wasteType: "Organic", amount: "5 kg", status: "Pending", date: "2026-05-24", resident: "Made Ayu", address: "Jl. Raya Ubud No. 12" },
  { id: "r2", type: "Used cooking oil", wasteType: "Oil", amount: "2 L", status: "Accepted", date: "2026-05-23", resident: "Ketut Dewi", address: "Jl. Monkey Forest 8" },
  { id: "r3", type: "Missed schedule", wasteType: "Non-organic", amount: "3 kg", status: "Completed", date: "2026-05-22", resident: "I Gusti Bagus", address: "Jl. Hanoman 22" },
  { id: "r4", type: "Extra waste", wasteType: "Recyclable", amount: "8 kg", status: "Scheduled", date: "2026-05-24", resident: "Nyoman Sari", address: "Jl. Tegallalang 5" },
];

export const mockAnnouncements = [
  { id: "a1", title: "New Organic Waste Policy in Bali", date: "2026-05-20", category: "Policy", pinned: true, body: "Starting June 2026, all households must separate organic waste at the source. ROUTE will provide dedicated organic pickups every Mon, Wed, Fri." },
  { id: "a2", title: "Schedule Change for Ubud Area", date: "2026-05-22", category: "Schedule", pinned: false, body: "Pickup time moves to 06:30 starting next week to avoid traffic congestion near the market." },
  { id: "a3", title: "Used Cooking Oil Collection Drive", date: "2026-05-18", category: "Event", pinned: false, body: "Drop off used cooking oil at any collection point this weekend. Earn community points." },
];

export const mockArticles = [
  { id: "e1", title: "Composting at Home: A Bali Guide", category: "Composting", readTime: 6, excerpt: "Turn your kitchen scraps into rich soil for your garden with this simple guide tailored for Bali's climate.", date: "2026-05-15", featured: true },
  { id: "e2", title: "How to Separate Organic & Inorganic Waste", category: "Separation", readTime: 4, excerpt: "A practical breakdown of which bin gets what — with photos.", date: "2026-05-10" },
  { id: "e3", title: "Recycling Used Cooking Oil Safely", category: "Recycling", readTime: 5, excerpt: "Used cooking oil can be turned into biodiesel. Here's how communities in Denpasar are doing it.", date: "2026-05-05" },
  { id: "e4", title: "Banjar Stories: Zero-Waste in Sanur", category: "Community", readTime: 8, excerpt: "A village near Sanur achieved 80% waste diversion in 18 months. Their playbook.", date: "2026-04-28" },
  { id: "e5", title: "Why Bali Banned Organic Waste in Landfills", category: "Organic", readTime: 7, excerpt: "Understanding the new regulation and what it means for residents.", date: "2026-04-20" },
];

export const mockHistory = [
  { id: "h1", date: "2026-05-22", type: "Pickup", description: "Organic waste — 4 kg", status: "Completed" },
  { id: "h2", date: "2026-05-20", type: "Request", description: "Extra waste request", status: "Completed" },
  { id: "h3", date: "2026-05-18", type: "Pickup", description: "Non-organic — 2 kg", status: "Completed" },
  { id: "h4", date: "2026-05-15", type: "Pickup", description: "Organic — 5 kg", status: "Failed: not sorted" },
  { id: "h5", date: "2026-05-13", type: "Request", description: "Used cooking oil — 1 L", status: "Completed" },
];

export const mockTodayJobs = [
  { id: "j1", resident: "Made Ayu", address: "Jl. Raya Ubud No. 12", notes: "Organic, sorted", status: "scheduled" as PickupStatus, time: "07:00" },
  { id: "j2", resident: "Ketut Dewi", address: "Jl. Monkey Forest 8", notes: "Used cooking oil 2L", status: "on_the_way" as PickupStatus, time: "07:30" },
  { id: "j3", resident: "I Gusti Bagus", address: "Jl. Hanoman 22", notes: "Mixed waste — large", status: "scheduled" as PickupStatus, time: "08:00" },
  { id: "j4", resident: "Nyoman Sari", address: "Jl. Tegallalang 5", notes: "Recyclables", status: "picked_up" as PickupStatus, time: "06:30" },
];

export const mockTransporters = [
  { id: "t1", name: "Wayan Sutha", area: "Zone A — Ubud", completed: 142, failed: 4, rate: 97 },
  { id: "t2", name: "Komang Aris", area: "Zone B — Sanur", completed: 128, failed: 9, rate: 93 },
  { id: "t3", name: "Putu Eka", area: "Zone C — Denpasar", completed: 156, failed: 3, rate: 98 },
];

export const mockAllUsers = [
  { id: "u1", name: "Made Ayu", email: "warga@route.id", role: "Resident", area: "Ubud", status: "Active" },
  { id: "u2", name: "Ketut Dewi", email: "ketut@mail.com", role: "Resident", area: "Ubud", status: "Active" },
  { id: "t1", name: "Wayan Sutha", email: "wayan@route.id", role: "Transporter", area: "Zone A", status: "Active" },
  { id: "t2", name: "Komang Aris", email: "komang@route.id", role: "Transporter", area: "Zone B", status: "Pending" },
  { id: "a1", name: "Putu Aditya", email: "admin@route.id", role: "Admin", area: "—", status: "Active" },
];

export const pickupTrend = [
  { day: "Mon", completed: 42, failed: 3 },
  { day: "Tue", completed: 38, failed: 2 },
  { day: "Wed", completed: 51, failed: 4 },
  { day: "Thu", completed: 47, failed: 1 },
  { day: "Fri", completed: 55, failed: 5 },
  { day: "Sat", completed: 33, failed: 2 },
  { day: "Sun", completed: 28, failed: 1 },
];

export const requestTrend = [
  { week: "W1", requests: 24 },
  { week: "W2", requests: 31 },
  { week: "W3", requests: 28 },
  { week: "W4", requests: 42 },
];
