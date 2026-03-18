import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function SquadsPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: playerData } = await supabase
      .from("players")
      .select("*")
      .order("name", { ascending: true });

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setPlayers(playerData || []);

    if (divisionData?.length) {
      const firstDivision = divisionData[0].id;
      setSelectedDivision(firstDivision);

      const firstTeam = (teamData || []).find((t) => t.division_id === firstDivision);
      if (firstTeam) setSelectedTeam(firstTeam.id);
    }
  }

  const filteredTeams = teams.filter((t) => t.division_id === selectedDivision);
  const filteredPlayers = players.filter((p) => p.team_id === selectedTeam);

  function handleDivisionChange(value) {
    setSelectedDivision(value);
    const firstTeam = teams.find((t) => t.division_id === value);
    setSelectedTeam(firstTeam ? firstTeam.id : "");
  }

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={linkStyle}>← Back to Home</Link>
      </div>

      <h1>Squad Lists</h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", margin: "20px 0" }}>
        <select
          value={selectedDivision}
          onChange={(e) => handleDivisionChange(e.target.value)}
          style={inputStyle}
        >
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          style={inputStyle}
        >
          {filteredTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>
          {filteredTeams.find((t) => t.id === selectedTeam)?.name || "Select a team"}
        </h2>

        {filteredPlayers.length === 0 ? (
          <p style={{ color: "#64748b" }}>No players added for this team yet.</p>
        ) : (
          <div style={gridStyle}>
            {filteredPlayers.map((player) => (
              <div key={player.id} style={playerCardStyle}>
                {player.name}
              </div>
            ))}
          </div>
        )}
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

const gridStyle = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const playerCardStyle = {
  padding: "14px 16px",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  background: "#f8fafc",
  fontWeight: "bold",
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
