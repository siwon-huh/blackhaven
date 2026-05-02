import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AboutHero from "@/components/about/AboutHero";
import FlowDiagram from "@/components/about/FlowDiagram";
import MechanicsCards from "@/components/about/MechanicsCards";
import PlaybookSection from "@/components/about/PlaybookSection";

export const metadata = {
  title: "About · Blackhaven",
  description:
    "Blackhaven 프로토콜 설명, 자금 흐름 다이어그램, 사용자 플레이북.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <AboutHero />
      <FlowDiagram />
      <MechanicsCards />
      <PlaybookSection />
      <SiteFooter />
    </main>
  );
}
