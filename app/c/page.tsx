import type { Metadata } from "next";
import MateriaViva from "@/components/MateriaViva";
import "../materia/materia.css";

export const metadata: Metadata = {
  title: "Materia Viva · Versione C",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MateriaViva version="c" />;
}
