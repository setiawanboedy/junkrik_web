import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Junkrik B2B",
  description: "Masuk ke akun bisnis Junkrik untuk mengelola pengumpulan sampah dan laporan keberlanjutan.",
};

export default function Page() {
  return <LoginForm />;
}
