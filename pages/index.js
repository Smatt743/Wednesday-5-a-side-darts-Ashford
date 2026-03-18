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

      <div style={{ marginBottom: "24px" }}>
        <Link href="/admin" style={{
          display: "inline-block",
          padding: "12px 18px",
          background: "#111827",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "10px",
          fontWeight: "bold",
        }}>
          Go to Admin
        </Link>
      </div>
    </main>
  );
}
