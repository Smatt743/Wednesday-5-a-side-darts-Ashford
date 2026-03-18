import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    division_id: "",
    date: "",
    home_team_id: "",
    away_team_id: "",
  });

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
  }

  async function addFixture(e) {
    e.preventDefault();

    const { error } = await supabase.from("fixtures").insert([form]);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Fixture added ✅");
      setForm({
        division_id: "",
        date: "",
        home_team_id: "",
        away_team_id: "",
      });
      loadData();
    }
  }

  function getTeamName(id) {
    return teams.find((t) => t.id === id)?.name || id;
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>Admin</h1>

      <form onSubmit={addFixture}>
        <select
          value={form.division_id}
          onChange={(e) =>
            setForm({ ...form, division_id: e.target.value })
          }
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        <br /><br />

        <select
          value={form.home_team_id}
          onChange={(e) =>
            setForm({ ...form, home_team_id: e.target.value })
          }
        >
          <option value="">Home Team</option>
          {teams
            .filter((t) => t.division_id === form.division_id)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>

        <br /><br />

        <select
          value={form.away_team_id}
          onChange={(e) =>
            setForm({ ...form, away_team_id: e.target.value })
          }
        >
          <option value="">Away Team</option>
          {teams
            .filter((t) => t.division_id === form.division_id)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>

        <br /><br />

        <button type="submit">Add Fixture</button>
      </form>

      {message && <p>{message}</p>}

      <h2 style={{ marginTop: "40px" }}>All Fixtures</h2>

      {fixtures.map((f) => (
        <div key={f.id} style={{ marginBottom: "10px" }}>
          {f.date} — {getTeamName(f.home_team_id)} vs {getTeamName(f.away_team_id)}
        </div>
      ))}
    </main>
  );
}
