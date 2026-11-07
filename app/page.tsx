import Journey from "@/components/Journey";
import { opening, stations, ui } from "@/content/stations";
import { config } from "@/config";

export default function Page() {
  const built = stations.filter((s) => (config.prototypeStations as readonly string[]).includes(s.id));
  return <Journey opening={opening} stations={built} allStations={stations} ui={ui} />;
}
