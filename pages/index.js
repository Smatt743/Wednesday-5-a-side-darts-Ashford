import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "12px" }}>
        Wednesday 5 a Side Darts League
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "24px" }}>
        Official league website for fixtures, results, tables and player statistics.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        <Link href="/table" style={buttonStyle}>
          League Tables
        </Link>

        <Link href="/fixtures" style={buttonStyle}>
          Fixtures & Results
        </Link>

        <Link href="/admin" style={buttonStyleDark}>
          Admin
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div style={cardStyle}>
          <h2>Division 1</h2>
          <p>Tables and results</p>
        </div>

        <div style={cardStyle}>
          <h2>Division 2</h2>
          <p>Fixtures and standings</p>
        </div>

        <div style={cardStyle}>
          <h2>Division 3</h2>
          <p>Player stats and squads</p>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  display: "inline-block",
  padding: "12px 18px",
  background: "#2563eb",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "bold",
};

const buttonStyleDark = {
  display: "inline-block",
  padding: "12px 18px",
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "bold",
};
