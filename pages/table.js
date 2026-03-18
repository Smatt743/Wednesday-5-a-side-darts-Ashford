import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function TablePage() {
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
    const { data: fixtureData } = await supabase.from("fixtures").select("*");

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

  function calculateTable() {
    const filtered = fixtures.filter(
      (f) => f.division_id === selectedDivision && f.played
    );

    const standings = {};

    filtered.forEach((f) => {
      if (!standings[f.home_team_id]) {
        standings[f.home_team_id] = {
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
          legsFor: 0,
          legsAgainst: 0,
        };
      }

      if (!standings[f.away_team_id]) {
        standings[f.away_team_id] = {
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
          legsFor: 0,
          legsAgainst: 0,
        };
      }

      standings[f.home_team_id].played++;
      standings[f.away_team_id].played++;

      standings[f.home_team_id].legsFor += f.home_score || 0;
      standings[f.home_team_id].legsAgainst += f.away_score || 0;
      standings[f.away_team_id].legsFor += f.away_score || 0;
      standings[f.away_team_id].legsAgainst += f.home_score || 0;

      if (f.home_score > f.away_score) {
        standings[f.home_team_id].won++;
        standings[f.home_team_id].points += 1;
        standings[f.away_team_id].lost++;
      } else if (f.away_score > f.home_score) {
        standings[f.away_team_id].won++;
        standings[f.away_team_id].points += 1;
        standings[f.home_team_id].lost++;
      }
    });

    return Object.entries(standings)
      .map(([team_id, stats]) => ({
        team: getTeamName(team_id),
        legDiff: stats.legsFor - stats.legsAgainst,
        ...stats,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
        return b.legsFor - a.legsFor;
      });
  }

  const table = calculateTable();
  const selectedDivisionName =
    divisions.find((d) => d.id === selectedDivision)?.name || "League Table";

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/" style={linkStyle}>← Back to Home</Link>
      </div>

      <div style={headerCard}>
        <h1 style={{ margin: 0 }}>League Tables</h1>
        <p style={{ color: "#64748b", marginBottom: 0 }}>
          Current standings for each division.
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

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>{selectedDivisionName}</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Pos</th>
              <th style={thStyle}>Team</th>
              <th style={thStyle}>P</th>
              <th style={thStyle}>W</th>
              <th style={thStyle}>L</th>
              <th style={thStyle}>LF</th>
              <th style={thStyle}>LA</th>
              <th style={thStyle}>Diff</th>
              <th style={thStyle}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, index) => (
              <tr
                key={row.team}
                style={index === 0 ? { background: "#eff6ff" } : undefined}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{row.team}</td>
                <td style={tdStyle}>{row.played}</td>
                <td style={tdStyle}>{row.won}</td>
                <td style={tdStyle}>{row.lost}</td>
                <td style={tdStyle}>{row.legsFor}</td>
                <td style={tdStyle}>{row.legsAgainst}</td>
                <td style={tdStyle}>{row.legDiff}</td>
                <td style={{ ...tdStyle, fontWeight: "bold" }}>{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
