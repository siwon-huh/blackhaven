import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HomeHero from "@/components/home/HomeHero";
import LaunchSnapshot from "@/components/LaunchSnapshot";
import FairValue from "@/components/FairValue";

export default function Page() {
  return (
    <main>
      <SiteHeader />
      <HomeHero />
      <LaunchSnapshot />
      <FairValue />
      <SiteFooter />
    </main>
  );
}
