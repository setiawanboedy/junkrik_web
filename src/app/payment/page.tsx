import type { Metadata } from "next";
import PaymentClient from "./PaymentClient";

export const metadata: Metadata = {
  title: "Pembayaran | Junkrik B2B",
  description: "Kelola pembayaran layanan pengelolaan sampah bisnis Anda di Junkrik.",
};

export default function Page() {
  return <PaymentClient />;
}
