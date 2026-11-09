import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Anteprima temporanea: fuori dai motori di ricerca anche a livello di header, non solo meta.
  // Le versioni A e B non ci sono più: i vecchi link portano all'unica versione di Materia Viva.
  async redirects() {
    return ["/a", "/b", "/c"].map((source) => ({ source, destination: "/materia-viva", permanent: false }));
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
