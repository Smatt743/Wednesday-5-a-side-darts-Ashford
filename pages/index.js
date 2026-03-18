import Link from "next/link";

export default function Home() {
  const cards = [
    {
      title: "League Tables",
      text: "View the latest standings across all divisions.",
      href: "/table",
      color: "#2563eb",
    },
    {
      title: "Fixtures & Results",
      text: "See upcoming matches and completed results.",
      href: "/fixtures",
      color: "#0f766e",
    },
    {
      title: "Player Stats",
      text: "Check win %, 180s and 100+ finishes.",
      href: "/player-stats",
      color: "#7c3aed",
    },
    {
      title: "Squad Lists",
      text: "Browse players by division and team.",
      href: "/squads",
      color: "#ea580c",
    },
  ];

  return (
    <main
      style={{
        maxWidth: "1150px",
        margin: "0 auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          borderRadius: "24px",
          padding: "36px",
          marginBottom: "28px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <p style={{ opacity: 0.85, marginTop: 0, marginBottom: "10px" }}>
          Official Website
        </p>
        <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1.1 }}>
          Wednesday 5 A Side Darts League
        </h1>
        <p style={{ fontSize: "18px", maxWidth: "720px", color: "#cbd5e1", marginTop: "16px" }}>
          Fixtures, results, tables, player stats and squad lists for all divisions in one place.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "22px",
          }}
        >
          <Link href="/table" style={heroButton}>
            View Tables
          </Link>
          <Link href="/fixtures" style={heroButtonAlt}>
            View Fixtures
          </Link>
          <Link href="/admin" style={heroButtonDark}>
            Admin
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gap: "18px",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              textDecoration: "none",
              color: "#0f172a",
              background: "#fff",
              borderRadius: "18px",
              padding: "22px",
              boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
              borderTop: `6px solid ${card.color}`,
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "10px" }}>{card.title}</h2>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{card.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

const heroButton = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
};

const heroButtonAlt = {
  padding: "12px 18px",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
};

const heroButtonDark = {
  padding: "12px 18px",
  background: "#111827",
  color: "#fff",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
};
