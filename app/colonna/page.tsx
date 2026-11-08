import type { Metadata } from "next";
import Journey from "@/components/Journey";
import { arrival, credits, opening, stations, ui } from "@/content/stations";
import { config } from "@/config";

export const metadata: Metadata = { title: "Punto G — colonna (versione precedente)", robots: { index: false, follow: false } };

export default function Page() {
  const built = config.stations ? stations.filter((s) => config.stations!.includes(s.id)) : stations;
  return <Journey opening={opening} stations={built} allStations={stations} arrival={arrival} credits={credits} ui={ui} />;
}
