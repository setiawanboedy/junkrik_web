import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profil Bisnis | Junkrik B2B",
  description: "Lihat dan edit profil bisnis Anda di platform Junkrik.",
};

export default function Page() {
  return <ProfileClient />;
}
