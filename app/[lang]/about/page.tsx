import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AboutHero from "@/components/about/AboutHero";
import FlowDiagram from "@/components/about/FlowDiagram";
import MechanicsCards from "@/components/about/MechanicsCards";
import Contracts from "@/components/about/Contracts";

export const metadata = {
  title: "About, Blackhaven",
  description: "Blackhaven 프로토콜 설명과 자금 흐름 다이어그램.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <AboutHero />
      <FlowDiagram />
      <MechanicsCards />
      <Contracts />
      <SiteFooter />
    </main>
  );
}
