export const metadata = {
  title: "Campus Notifications",
  description: "AffordMed campus notification platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}