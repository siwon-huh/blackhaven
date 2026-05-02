"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LaunchSnapshot from "@/components/LaunchSnapshot";
import FairValue from "@/components/FairValue";
import HowItWorks from "@/components/HowItWorks";
import HorizonPicker from "@/components/HorizonPicker";
import ScenarioBoard from "@/components/ScenarioBoard";
import HomeForksLink from "@/components/HomeForksLink";
import Footer from "@/components/Footer";
import { findScenario, Horizon } from "@/lib/scenarios";

export default function Page() {
  const [active, setActive] = useState<Horizon>("short");
  const scenario = findScenario(active);

  return (
    <main>
      <Header />
      <Hero />
      <LaunchSnapshot />
      <FairValue />
      <HowItWorks />
      <HorizonPicker active={active} onSelect={setActive} />
      <ScenarioBoard scenario={scenario} />
      <HomeForksLink />
      <Footer />
    </main>
  );
}
