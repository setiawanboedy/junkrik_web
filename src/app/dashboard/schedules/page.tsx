import type { Metadata } from "next";
import SchedulesClient from "./SchedulesClient";

export const metadata: Metadata = {
  title: "Jadwal Rutin | Junkrik B2B",
  description: "Atur jadwal rutin pengambilan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <SchedulesClient />;
}
