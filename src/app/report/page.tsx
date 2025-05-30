import type { Metadata } from "next";
import ReportClient from "./ReportClient";

export const metadata: Metadata = {
  title: "Laporan Sampah | Junkrik B2B",
  description: "Akses laporan pengelolaan sampah dan kepatuhan EPR bisnis Anda di Junkrik.",
};

export default function Page() {
  return <ReportClient />;
}
