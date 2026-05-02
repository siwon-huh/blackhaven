import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RisksHero from "@/components/risks/RisksHero";
import AuditFindings from "@/components/risks/AuditFindings";
import ProtocolRisks from "@/components/risks/ProtocolRisks";
import UserRisks from "@/components/risks/UserRisks";
import RisksFooter from "@/components/risks/RisksFooter";

export const metadata = {
  title: "Risks · Blackhaven",
  description:
    "Zellic 외부 감사 finding 과 프로토콜 리스크, 사용자 진입 시나리오 리스크.",
};

export default function RisksPage() {
  return (
    <main>
      <SiteHeader />
      <RisksHero />
      <AuditFindings />
      <UserRisks />
      <ProtocolRisks />
      <RisksFooter />
      <SiteFooter />
    </main>
  );
}
