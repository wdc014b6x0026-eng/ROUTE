import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Leaf, Calendar, Truck, PlusCircle, BookOpen, Users, ArrowRight, CheckCircle2, Sparkles,
  Recycle, Trash2, MapPin, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ROUTE — Smart Waste Coordination for Sustainable Communities" },
      { name: "description", content: "ROUTE helps Bali residents, transport workers, and admins coordinate waste collection, track pickups in real-time, and build sustainable communities." },
      { property: "og:title", content: "ROUTE — Smart Waste Coordination" },
      { property: "og:description", content: "Routing & Operational Updates for Trash Execution." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/assets/logo-full.png" alt="ROUTE" className="h-12 object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#how" className="hover:text-primary transition">How it works</a>
          <a href="#mission" className="hover:text-primary transition">Mission</a>
          <Link to="/education" className="hover:text-primary transition">Education</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition">Login</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-soft">Get started</Link>
        </div>
      </div>
    </header>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft pointer-events-none" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <Sparkles className="size-3.5" /> Built for Bali's new organic waste policy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Smart waste coordination for <span className="text-primary">sustainable communities</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              ROUTE connects residents, transport workers, and administrators on one platform — making pickups predictable, transparent, and educational.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition">
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border font-medium hover:bg-muted transition">
                Sign in
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Real-time tracking</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Role-based</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /> Free for residents</div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-card rounded-3xl border border-border shadow-card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Next pickup</div>
                  <div className="font-display font-bold text-xl">Wednesday, 07:00</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-info/15 text-info text-xs font-medium">On the way</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Organic", color: "bg-success" },
                  { label: "Non-organic", color: "bg-info" },
                  { label: "Recyclable", color: "bg-warning" },
                ].map((b) => (
                  <div key={b.label} className="rounded-xl bg-muted/50 p-3">
                    <div className={`size-2 rounded-full ${b.color} mb-2`}></div>
                    <div className="text-xs text-muted-foreground">Today</div>
                    <div className="text-sm font-medium">{b.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  ["07:12", "Truck dispatched from depot"],
                  ["07:24", "Approaching Jl. Raya Ubud"],
                  ["07:31", "Arriving in 4 minutes"],
                ].map(([t, msg]) => (
                  <div key={t} className="flex items-center gap-3 text-sm">
                    <div className="text-xs text-muted-foreground w-12 shrink-0">{t}</div>
                    <div className="flex-1">{msg}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl border border-border shadow-card p-4 hidden md:flex items-center gap-3">
              <div className="size-10 rounded-xl bg-success/15 flex items-center justify-center">
                <Recycle className="size-5 text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">This week</div>
                <div className="font-bold">+82 kg recycled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "12k+", l: "Active residents" },
            { v: "340", l: "Transport workers" },
            { v: "98%", l: "Pickup completion" },
            { v: "65t", l: "Organic waste diverted" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display font-bold text-3xl md:text-4xl text-primary">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Features</div>
          <h2 className="text-3xl md:text-4xl font-bold">Everything your community needs</h2>
          <p className="text-muted-foreground mt-3">From scheduled pickups to ad-hoc requests, ROUTE keeps the whole loop in sync.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { i: Calendar, t: "Smart Scheduling", d: "Recurring pickup days per area, automatically pushed to residents and assigned to transporters." },
            { i: Truck, t: "Real-time Pickup Tracking", d: "See the truck's status — scheduled, on the way, arrived, or picked up — without making a call." },
            { i: PlusCircle, t: "Flexible Pickup Requests", d: "Need extra pickup or had a missed schedule? Submit a request in 30 seconds." },
            { i: BookOpen, t: "Waste Education", d: "Bite-sized articles on composting, separation, and recycling cooking oil." },
            { i: Users, t: "Community Sustainability", d: "Track community impact, celebrate banjars hitting zero-waste milestones." },
            { i: BarChart3, t: "Admin Analytics", d: "Pickup completion, request trends, transporter performance — all in one dashboard." },
          ].map((f) => (
            <div key={f.t} className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft hover:-translate-y-0.5 transition">
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.i className="size-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">How it works</div>
            <h2 className="text-3xl md:text-4xl font-bold">Three steps to better pickups</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", i: Trash2, t: "Sort your waste", d: "Separate organic, non-organic and recyclables at home using ROUTE's color guide." },
              { n: "02", i: MapPin, t: "Schedule or request", d: "Your area's recurring schedule is auto-loaded. Need more? Send a request." },
              { n: "03", i: Truck, t: "Track & confirm", d: "Watch your pickup happen live, and rate the experience to help the community." },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <div className="text-xs font-bold text-primary">{s.n}</div>
                <div className="size-12 rounded-2xl bg-gradient-hero text-primary-foreground flex items-center justify-center my-4 shadow-soft">
                  <s.i className="size-5" />
                </div>
                <h3 className="font-semibold text-lg">{s.t}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="max-w-7xl mx-auto px-4 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Our mission</div>
          <h2 className="text-3xl md:text-4xl font-bold">A cleaner Bali, one pickup at a time</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Bali generates over 1.6 million tonnes of waste per year, and the new organic waste regulations demand better coordination. ROUTE turns that challenge into a community opportunity.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Empower residents with transparency",
              "Equip transport workers with clear schedules",
              "Give administrators real-time insight",
              "Educate every household on sustainable habits",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-hero rounded-3xl p-10 text-primary-foreground shadow-soft">
          <img src="/assets/logo-icon-white.png" alt="ROUTE" className="size-22 mb-6 object-contain opacity-90" />
          <div className="text-4xl font-display font-bold">2030</div>
          <div className="text-xl mt-2 opacity-90">Bali's zero-waste vision</div>
          <p className="mt-4 opacity-80">Join thousands of households already coordinating pickups through ROUTE to make this vision real.</p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-background text-primary font-medium hover:opacity-90 transition">
            Join the movement <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-16">
        <div className="bg-card border border-border rounded-3xl p-10 md:p-14 text-center shadow-card">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to coordinate smarter?</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Sign up as a resident or transport worker and start using ROUTE in minutes.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition">Create account</Link>
            <Link to="/login" className="px-6 py-3 rounded-xl border border-border font-medium hover:bg-muted transition">Sign in</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/assets/logo-icon.png" alt="ROUTE" className="h-18 object-contain" />
          </div>
          <div className="text-sm text-muted-foreground">© 2026 ROUTE. Built for a sustainable Bali.</div>
        </div>
      </footer>
    </div>
  );
}
