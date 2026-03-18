export const metadata = {
  title: "Wednesday 5 a Side Darts League",
  description: "Official league website for fixtures, results, tables and player statistics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, background: "#f8fafc", color: "#0f172a" }}>
        {children}
      </body>
    </html>
  );
}
