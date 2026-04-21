import "../scss/site.scss"

export const metadata = {
  title: "Extraordinary Aliens",
  description: "Studio based in NYC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
