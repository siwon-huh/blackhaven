import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlaybookHero from "@/components/playbook/PlaybookHero";
import CapitalGuide from "@/components/playbook/CapitalGuide";
import PlaybookSection from "@/components/about/PlaybookSection";

export const metadata = {
  title: "Playbook, Blackhaven",
  description: "초단기, 초기, 중기 시간축의 사용자 플레이.",
};

export default function PlaybookPage() {
  return (
    <main>
      <SiteHeader />
      <PlaybookHero />
      <CapitalGuide />
      <PlaybookSection />
      <SiteFooter />
    </main>
  );
}
