import Journey from "@/components/Journey";
import { arrival, opening, stations, ui } from "@/content/stations";
import { config } from "@/config";

export default function Page() {
  const built = config.stations ? stations.filter((s) => config.stations!.includes(s.id)) : stations;
  return <Journey opening={opening} stations={built} allStations={stations} arrival={arrival} ui={ui} />;
}
