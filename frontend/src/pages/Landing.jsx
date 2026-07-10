import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GrowthRings from "../components/GrowthRings";

const Landing = () => {
  const { user } = useAuth();
  const primaryCta = user
    ? { to: "/dashboard", label: "Go to your dashboard" }
    : { to: "/register", label: "Start tracking \u2014 it's free" };

  return (
    <div className="font-sans text-pine">
      <header className="sticky top-0 z-20 bg-pine/95 backdrop-blur border-b border-pine2">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl text-mist tracking-tight">
            CarbonTrack
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-mosslight">
            <a href="#how-it-works" className="hover:text-mist transition-colors">How it works</a>
            <a href="#features" className="hover:text-mist transition-colors">Features</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-mist font-medium hover:text-white transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-mist font-medium hover:text-white transition-colors">
                  Log in
                </Link>
                <Link
                  to={primaryCta.to}
                  className="text-sm font-medium bg-moss text-white px-4 py-2 rounded-full hover:bg-mosslight hover:text-pine transition-colors"
                >
                  {primaryCta.label}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative bg-pine overflow-hidden">
        <GrowthRings
          className="absolute -right-24 -top-24 w-[560px] h-[560px] pointer-events-none"
          stroke="#4C7C4A"
          opacity={0.5}
        />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-28 relative grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-clay text-sm font-semibold tracking-[0.15em] uppercase mb-5">
              Personal carbon tracking
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-mist mb-6">
              See what you emit.<br />Know what to change.
            </h1>
            <p className="text-mosslight text-lg leading-relaxed mb-9 max-w-md">
              Log your transport, food, and utility use. We calculate the real CO2e behind
              each entry, then help you cut it down through challenges &mdash; and offset
              what's left through verified projects.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={primaryCta.to}
                className="bg-moss text-white px-7 py-3.5 rounded-full font-medium hover:bg-mosslight hover:text-pine transition-colors"
              >
                {primaryCta.label}
              </Link>
              <a
                href="#how-it-works"
                className="text-mist px-2 py-3.5 font-medium border-b border-transparent hover:border-mosslight transition-colors"
              >
                See how it works &darr;
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="bg-mist rounded-2xl shadow-2xl p-6 max-w-sm ml-auto">
              <p className="text-xs font-semibold text-sage tracking-wide uppercase mb-4">Today's log</p>
              {[
                ["\ud83d\ude97", "Car \u00b7 12 km", "2.30 kg"],
                ["\ud83c\udf7d\ufe0f", "Vegetarian meal", "1.70 kg"],
                ["\u26a1", "Electricity \u00b7 4 kWh", "1.90 kg"],
              ].map(([icon, label, val], i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-sage/15 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm text-pine">{label}</span>
                  </div>
                  <span className="text-sm text-sage font-medium">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 mt-1">
                <span className="text-sm font-semibold text-pine">Total today</span>
                <span className="font-display text-2xl text-moss">5.90 kg</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pine2 border-t border-pine">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["7", "activity categories"],
            ["100%", "verified offset providers"],
            ["Team", "corporate challenges"],
            ["Live", "footprint recalculation"],
          ].map(([n, l], i) => (
            <div key={i}>
              <p className="font-display text-2xl text-mist">{n}</p>
              <p className="text-xs text-mosslight mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-mist py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-clay text-sm font-semibold tracking-[0.15em] uppercase mb-3">How it works</p>
          <h2 className="font-display text-4xl text-pine mb-16 max-w-xl">Three steps, in order</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              ["01", "Track", "Log a commute, a meal, a utility bill \u2014 whatever you did today. Takes seconds."],
              ["02", "Reduce", "Join a challenge, watch your footprint trend down, and climb the leaderboard."],
              ["03", "Offset", "Buy verified credits for what's left, from providers we've personally reviewed."],
            ].map(([num, title, desc], i) => (
              <div key={i} className="relative">
                <span className="font-display text-6xl text-mosslight/50 block mb-4">{num}</span>
                <h3 className="font-display text-2xl text-pine mb-3">{title}</h3>
                <p className="text-sage leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-24 border-t border-mosslight/20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-clay text-sm font-semibold tracking-[0.15em] uppercase mb-3">What's inside</p>
          <h2 className="font-display text-4xl text-pine mb-16 max-w-xl">Everything you need to act on your impact</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {[
              ["Activity logging", "Seven categories \u2014 transport, food, electricity, water, gas, waste, and more."],
              ["Footprint engine", "Every entry converts to kg CO2e using research-based emission factors."],
              ["Challenges & leaderboard", "Set a reduction target, track progress, and see where you rank."],
              ["Offset marketplace", "Browse tree-planting, renewable energy, and conservation projects."],
              ["Community feed", "Share milestones, swap tips, and cheer on people doing the same work."],
              ["Corporate teams", "Bring your organization in and compete department to department."],
            ].map(([title, desc], i) => (
              <div key={i}>
                <div className="w-10 h-10 rounded-full bg-mist border border-mosslight/40 flex items-center justify-center mb-4">
                  <span className="w-2 h-2 rounded-full bg-moss" />
                </div>
                <h3 className="font-display text-xl text-pine mb-2">{title}</h3>
                <p className="text-sage leading-relaxed text-[15px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-pine py-24 overflow-hidden">
        <GrowthRings
          className="absolute -left-32 -bottom-32 w-[480px] h-[480px] pointer-events-none"
          stroke="#C97A3D"
          opacity={0.25}
        />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="font-display text-4xl md:text-5xl text-mist mb-6 leading-tight">
            Your footprint is already happening.<br />Start seeing it.
          </h2>
          <p className="text-mosslight mb-10 text-lg">
            Free to join. Takes two minutes to log your first activity.
          </p>
          <Link
            to={primaryCta.to}
            className="inline-block bg-moss text-white px-8 py-4 rounded-full font-medium hover:bg-mosslight hover:text-pine transition-colors"
          >
            {primaryCta.label}
          </Link>
        </div>
      </section>

      <footer className="bg-pine2 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-mist">CarbonTrack</span>
          <p className="text-sage text-sm">Personal Carbon Footprint Tracker with Marketplace Offsets</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;