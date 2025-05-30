import type { Metadata } from "next";
import ScheduleClient from "./ScheduleClient";

export const metadata: Metadata = {
  title: "Jadwal Pengambilan | Junkrik B2B",
  description: "Lihat dan atur jadwal pengambilan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <ScheduleClient />;
}
