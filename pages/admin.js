import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [table, setTable] = useState([]);
  const [message, setMessage] = useState("");

  const [playerForm, setPlayerForm] = useState({
    name: "",
    team_id: "",
  });

  const [statsForm, setStatsForm] = useState({
    fixture_id: "",
    player_id: "",
    legs_played: "",
    legs_won: "",
    one_eighties: "",
    ton_plus_finishes: "",
  });

  useEffect(() => {
    async function setupAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    setupAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  async function loadData() {
    const { data: divisionData } = await supabase.from("divisions").select("*");
    const { data: teamData } = await supabase.from("teams").select("*");
    const { data: fixtureData } = await supabase
      .from("fixtures")
      .select("*")
      .order("date", { ascending: true });
    const { data: playerData } = await supabase.from("players").select("*");

    setDivisions(divisionData || []);
    setTeams(teamData || []);
    setFixtures(fixtureData || []);
    setPlayers(playerData || []);

    if (!selectedDivision && divisionData?.length) {
      setSelectedDivision(divisionData[0].id);
    }
  }

  async function signIn(e) {
    e.preventDefault();
    setAuthMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
    } else {
      setEmail("");
      setPassword("");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function getTeamName(id) {
    return teams.find((t) => t.id === id)?.name || "";
  }

  async function updateScore(id, field, value) {
    await supabase
      .from("fixtures")
      .update({ [field]: parseInt(value || 0) })
      .eq("id", id);
    loadData();
  }

  async function markPlayed(id) {
    await supabase.from("fixtures").update({ played: true }).eq("id", id);
    loadData();
  }

  async function addPlayer(e) {
    e.preventDefault();

    const payload = {
      name: playerForm.name,
      team_id: playerForm.team_id,
    };

    const { error } = await supabase.from("players").insert([payload]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Player added ✅");
      setPlayerForm({ name: "", team_id: "" });
      loadData();
    }
  }

  async function addPlayerStats(e) {
    e.preventDefault();

    const payload = {
      fixture_id: statsForm.fixture_id,
      player_id: statsForm.player_id,
      legs_played: parseInt(statsForm.legs_played || 0),
      legs_won: parseInt(statsForm.legs_won || 0),
      one_eighties: parseInt(statsForm.one_eighties || 0),
      ton_plus_finishes: parseInt(statsForm.ton_plus_finishes || 0),
    };

    const { error } = await supabase.from("player_stats").insert([payload]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Player stats added ✅");
      setStatsForm({
        fixture_id: "",
        player_id: "",
        legs_played: "",
        legs_won: "",
        one_eighties: "",
        ton_plus_finishes: "",
      });
    }
  }

  function calculateTable() {
    const filtered = fixtures.filter(
      (f) => f.division_id === selectedDivision && f.played
    );

    let standings = {};

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

    const tableArray = Object.entries(standings).map(([team_id, stats]) => ({
      team: getTeamName(team_id),
      legDiff: stats.legsFor - stats.legsAgainst,
      ...stats,
    }));

    tableArray.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
      return b.legsFor - a.legsFor;
    });

    setTable(tableArray);
  }

  const filteredTeams = teams.filter((t) => t.division_id === selectedDivision);

  if (loading) {
    return (
      <main style={{ padding: "32px", fontFamily: "Arial" }}>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!session) {
    return (
      <main
        style={{
          maxWidth: "500px",
          margin: "60px auto",
          padding: "32px",
          fontFamily: "Arial, sans-serif",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Admin Login</h1>

        <form onSubmit={signIn}>
          <div style={{ marginBottom: "12px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>

        {authMessage ? (
          <p style={{ marginTop: "16px", color: "#b91c1c" }}>{authMessage}</p>
        ) : null}
      </main>
    );
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Admin</h1>
        <button onClick={signOut} style={buttonStyle}>
          Sign Out
        </button>
      </div>

      <p style={{ color: "#475569" }}>
        Signed in as: {session.user.email}
      </p>

      <select
        value={selectedDivision}
        onChange={(e) => setSelectedDivision(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Division</option>
        {divisions.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button onClick={calculateTable} style={{ ...buttonStyle, marginLeft: "10px" }}>
        Generate Table
      </button>

      <h2 style={{ marginTop: "30px" }}>Fixtures</h2>

      {fixtures
        .filter((f) => f.division_id === selectedDivision)
        .map((f) => (
          <div key={f.id} style={{ marginBottom: "10px" }}>
            {f.date} — {getTeamName(f.home_team_id)} vs {getTeamName(f.away_team_id)}
            <br />
            <input
              type="number"
              value={f.home_score}
              onChange={(e) => updateScore(f.id, "home_score", e.target.value)}
              style={smallInputStyle}
            />
            <input
              type="number"
              value={f.away_score}
              onChange={(e) => updateScore(f.id, "away_score", e.target.value)}
              style={smallInputStyle}
            />
            <button onClick={() => markPlayed(f.id)} style={{ marginLeft: "8px" }}>
              Mark Played
            </button>
          </div>
        ))}

      <h2 style={{ marginTop: "40px" }}>Add Player to Team</h2>

      <form onSubmit={addPlayer}>
        <input
          type="text"
          placeholder="Player name"
          value={playerForm.name}
          onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
          style={inputStyle}
        />

        <select
          value={playerForm.team_id}
          onChange={(e) => setPlayerForm({ ...playerForm, team_id: e.target.value })}
          style={{ ...inputStyle, marginLeft: "8px" }}
        >
          <option value="">Select team</option>
          {filteredTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button type="submit" style={{ ...buttonStyle, marginLeft: "8px" }}>
          Add Player
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>Add Player Stats</h2>

      <form onSubmit={addPlayerStats}>
        <select
          value={statsForm.fixture_id}
          onChange={(e) => setStatsForm({ ...statsForm, fixture_id: e.target.value })}
          style={inputStyle}
        >
          <option value="">Select fixture</option>
          {fixtures
            .filter((f) => f.division_id === selectedDivision)
            .map((f) => (
              <option key={f.id} value={f.id}>
                {f.date} - {getTeamName(f.home_team_id)} vs {getTeamName(f.away_team_id)}
              </option>
            ))}
        </select>

        <select
          value={statsForm.player_id}
          onChange={(e) => setStatsForm({ ...statsForm, player_id: e.target.value })}
          style={{ ...inputStyle, marginLeft: "8px" }}
        >
          <option value="">Select player</option>
          {players
            .filter((p) => filteredTeams.some((t) => t.id === p.team_id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({getTeamName(p.team_id)})
              </option>
            ))}
        </select>

        <div style={{ marginTop: "12px" }}>
          <input
            type="number"
            placeholder="Legs played"
            value={statsForm.legs_played}
            onChange={(e) => setStatsForm({ ...statsForm, legs_played: e.target.value })}
            style={smallInputStyle}
          />
          <input
            type="number"
            placeholder="Legs won"
            value={statsForm.legs_won}
            onChange={(e) => setStatsForm({ ...statsForm, legs_won: e.target.value })}
            style={smallInputStyle}
          />
          <input
            type="number"
            placeholder="180s"
            value={statsForm.one_eighties}
            onChange={(e) => setStatsForm({ ...statsForm, one_eighties: e.target.value })}
            style={smallInputStyle}
          />
          <input
            type="number"
            placeholder="100+ finishes"
            value={statsForm.ton_plus_finishes}
            onChange={(e) => setStatsForm({ ...statsForm, ton_plus_finishes: e.target.value })}
            style={smallInputStyle}
          />
        </div>

        <button type="submit" style={{ ...buttonStyle, marginTop: "12px" }}>
          Add Stats
        </button>
      </form>

      <h2 style={{ marginTop: "40px" }}>League Table</h2>

      {table.map((t, i) => (
        <div key={i}>
          {i + 1}. {t.team} — P: {t.played} W: {t.won} L: {t.lost} LF: {t.legsFor} LA: {t.legsAgainst} Diff: {t.legDiff} Pts: {t.points}
        </div>
      ))}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </main>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
};

const smallInputStyle = {
  width: "120px",
  padding: "8px 10px",
  marginRight: "8px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

const buttonStyle = {
  padding: "10px 16px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};
