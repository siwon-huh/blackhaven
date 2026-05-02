import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ForksHero from "@/components/forks/ForksHero";
import ForkTimeline from "@/components/forks/ForkTimeline";
import PriceCurveChart from "@/components/forks/PriceCurveChart";
import ForkCards from "@/components/forks/ForkCards";
import PatternsBlock from "@/components/forks/PatternsBlock";
import LessonsBlock from "@/components/forks/LessonsBlock";
import CrossLink from "@/components/forks/CrossLink";

export const metadata = {
  title: "OHM Forks Postmortem · Blackhaven",
  description:
    "OlympusDAO 와 그 포크들의 흥망성쇠, 공통 실패 패턴, Blackhaven 의 차이.",
};

export default function ForksPage() {
  return (
    <main>
      <SiteHeader />
      <ForksHero />
      <PriceCurveChart />
      <ForkTimeline />
      <ForkCards />
      <PatternsBlock />
      <LessonsBlock />
      <CrossLink />
      <SiteFooter />
    </main>
  );
}
