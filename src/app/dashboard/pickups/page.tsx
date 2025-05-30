import type { Metadata } from "next";
import PickupsClient from "./PickupsClient";

export const metadata: Metadata = {
  title: "Jadwal Pengambilan | Junkrik B2B",
  description: "Kelola dan pantau jadwal pengambilan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <PickupsClient />;
}
