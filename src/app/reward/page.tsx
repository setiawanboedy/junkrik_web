import type { Metadata } from "next";
import RewardClient from "./RewardClient";

export const metadata: Metadata = {
  title: "Reward & Insentif | Junkrik B2B",
  description: "Dapatkan reward dan insentif dari pengelolaan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <RewardClient />;
}
