import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Bisnis | Junkrik B2B",
  description: "Registrasi bisnis Anda di Junkrik untuk layanan pengelolaan sampah dan reward keberlanjutan.",
};

export default function Page() {
  return <RegisterForm />;
}
