import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>
        Wednesday 5 A Side Darts League
      </h1>

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

        <Link href="/player-stats" style={buttonStyle}>
          Player Stats
        </Link>

        <Link href="/squads" style={buttonStyle}>
          Squad Lists
        </Link>

        <Link href="/admin" style={buttonStyleDark}>
          Admin
        </Link>
      </div>

      <div style={cardStyle}>
        <h2>Welcome</h2>
        <p>
          Welcome to the Wednesday 5 a side darts league website.
          Use the buttons above to view fixtures, tables, player stats and squad lists.
        </p>
      </div>
    </main>
  );
}

const buttonStyle = {
  padding: "12px 16px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
};

const buttonStyleDark = {
  padding: "12px 16px",
  background: "#111827",
  color: "#fff",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
};

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};
