import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | Junkrik B2B",
  description: "Dashboard utama untuk monitoring pengelolaan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <DashboardClient />;
}
