import { UserSessionProvider } from "@/providers/userSessionProvider/UserSessionProvider";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <UserSessionProvider>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <main>{children}</main>
        </UserSessionProvider>
      </body>
    </html>
  );
}
