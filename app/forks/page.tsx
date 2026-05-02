import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForksHero from "@/components/forks/ForksHero";
import ForkTimeline from "@/components/forks/ForkTimeline";
import ForkCards from "@/components/forks/ForkCards";
import PatternsBlock from "@/components/forks/PatternsBlock";
import LessonsBlock from "@/components/forks/LessonsBlock";
import CrossLink from "@/components/forks/CrossLink";

export const metadata = {
  title: "OHM 포크 포스트모템 · Blackhaven",
  description:
    "OlympusDAO와 그 포크들이 어떻게 진행되었는지, 공통 실패 패턴 7개, Blackhaven이 다르게 한 것.",
};

export default function ForksPage() {
  return (
    <main>
      <Header />
      <ForksHero />
      <ForkTimeline />
      <ForkCards />
      <PatternsBlock />
      <LessonsBlock />
      <CrossLink />
      <Footer />
    </main>
  );
}
