import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function FixturesPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .order("date", { ascending: true });

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setFixtures(fixtureData || []);

    if (divisionData?.length) {
      setSelectedDivision(divisionData[0].id);
    }
  }

  function getTeamName(id) {
    return teams.find((t) => t.id === id)?.name || "";
  }

  const filteredFixtures = fixtures.filter(
    (f) => f.division_id === selectedDivision
  );

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={linkStyle}>← Back to Home</Link>
      </div>

      <div style={headerCard}>
        <h1 style={{ margin: 0 }}>Fixtures & Results</h1>
        <p style={{ color: "#64748b", marginBottom: 0 }}>
          Upcoming matches and completed results by division.
        </p>
      </div>

      <div style={{ margin: "20px 0" }}>
        <select
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
          style={inputStyle}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {filteredFixtures.map((f) => (
          <div key={f.id} style={cardStyle}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
              {f.date}
            </div>

            <div style={{ fontSize: "19px", fontWeight: "bold" }}>
              {getTeamName(f.home_team_id)}{" "}
              {f.played ? f.home_score : ""}
              {" "}
              {f.played ? "-" : "vs"}
              {" "}
              {f.played ? f.away_score : ""}
              {" "}
              {getTeamName(f.away_team_id)}
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: f.played ? "#0f766e" : "#92400e",
                fontWeight: "bold",
              }}
            >
              {f.played ? "Result entered" : "Fixture to play"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const pageStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "32px",
  fontFamily: "Arial, sans-serif",
};

const headerCard = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
};

const linkStyle = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "bold",
};
