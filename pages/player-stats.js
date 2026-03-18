import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function PlayerStatsPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: playerData } = await supabase.from("players").select("*");
    const { data: statData } = await supabase.from("player_stats").select("*");

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setPlayers(playerData || []);
    setStats(statData || []);

    if (divisionData?.length) setSelectedDivision(divisionData[0].id);
  }

  function getTeam(teamId) {
    return teams.find((t) => t.id === teamId);
  }

  const rows = players
    .filter((player) => getTeam(player.team_id)?.division_id === selectedDivision)
    .map((player) => {
      const playerRows = stats.filter((s) => s.player_id === player.id);

      const totals = playerRows.reduce(
        (acc, row) => {
          acc.legsPlayed += row.legs_played || 0;
          acc.legsWon += row.legs_won || 0;
          acc.oneEighties += row.one_eighties || 0;
          acc.tonPlusFinishes += row.ton_plus_finishes || 0;
          return acc;
        },
        { legsPlayed: 0, legsWon: 0, oneEighties: 0, tonPlusFinishes: 0 }
      );

      return {
        name: player.name,
        team: getTeam(player.team_id)?.name || "",
        ...totals,
      };
    })
    .sort((a, b) => {
      if (b.legsWon !== a.legsWon) return b.legsWon - a.legsWon;
      if (b.oneEighties !== a.oneEighties) return b.oneEighties - a.oneEighties;
      return b.tonPlusFinishes - a.tonPlusFinishes;
    });

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={linkStyle}>← Back to Home</Link>
      </div>

      <h1>Player Stats</h1>

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

      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Player</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>Legs Played</th>
              <th style={thStyle}>Legs Won</th>
              <th style={thStyle}>180s</th>
              <th style={thStyle}>100+ Finishes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.name}-${row.team}`}>
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.team}</td>
                <td style={tdStyle}>{row.legsPlayed}</td>
                <td style={tdStyle}>{row.legsWon}</td>
                <td style={tdStyle}>{row.oneEighties}</td>
                <td style={tdStyle}>{row.tonPlusFinishes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "16px",
  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
  overflowX: "auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  background: "#f8fafc",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
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
