import HomeDashboard from "@/components/HomeDashboard";
import { games } from "@/data/games";

export default function HomePage() {
  return <HomeDashboard games={games} />;
}
