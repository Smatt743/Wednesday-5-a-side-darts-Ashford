export default function HomePage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "12px" }}>
        Wednesday 5 a Side Darts League
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "24px" }}>
        Official league website for fixtures, results, tables and player statistics.
      </p>

      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "32px" }}>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h2>Division 1</h2>
          <p>Tables and results</p>
        </div>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h2>Division 2</h2>
          <p>Fixtures and standings</p>
        </div>
        <div style={{ background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h2>Division 3</h2>
          <p>Player stats and squads</p>
        </div>
      </div>

      <div style={{ background: "#fff", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <h2>Admin</h2>
        <p>
          This starter homepage is now valid and deployable. Once this build succeeds, we can add the full live admin,
          fixtures, results, player stats, and Supabase connection cleanly.
        </p>
      </div>
    </main>
  );
}
