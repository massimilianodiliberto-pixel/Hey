import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Anteprima temporanea: fuori dai motori di ricerca anche a livello di header, non solo meta.
  // I vecchi link portano alla versione 3 di Materia Viva.
  async redirects() {
    return ["/a", "/b", "/c", "/materia-viva"].map((source) => ({ source, destination: "/materia-viva/3", permanent: false }));
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
