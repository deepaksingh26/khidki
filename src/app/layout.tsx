import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://khidkee.in"),
  title: {
    default: "Khidkee | खिड़की",
    template: "%s | Khidkee"
  },
  description:
    "Khidkee is a community field intelligence platform that helps grassroots teams see who is nearby, who has not been reached, and where they need to go next.",
  applicationName: "Khidkee",
  keywords: [
    "Khidkee",
    "field intelligence",
    "rural operations",
    "community platform",
    "NGO outreach",
    "grassroots technology"
  ],
  openGraph: {
    title: "Khidkee | खिड़की",
    description:
      "A mobile-first field platform for outreach teams, volunteers, and coordinators working in rural India.",
    url: "https://khidkee.in",
    siteName: "Khidkee",
    locale: "en_IN",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#1C0F00",
  colorScheme: "light",
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
