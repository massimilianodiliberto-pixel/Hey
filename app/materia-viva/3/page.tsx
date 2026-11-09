import type { Metadata } from "next";
import MateriaViva from "@/components/MateriaViva";
import "../../materia/materia.css";

export const metadata: Metadata = {
  title: "Materia Viva · Versione 3 — Il volto in 3D",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MateriaViva face="3d" />;
}
