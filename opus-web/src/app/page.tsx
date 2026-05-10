import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { BeehiveBrain } from "@/components/BeehiveBrain";
import { Architecture } from "@/components/Architecture";
import { TechStack } from "@/components/TechStack";
import { LiveSwarm } from "@/components/LiveSwarm";
import { GreatWork } from "@/components/GreatWork";
import { BuildLog } from "@/components/BuildLog";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <BeehiveBrain />
      <Architecture />
      <TechStack />
      <LiveSwarm />
      <GreatWork />
      <BuildLog />
      <CallToAction />
      <Footer />
    </main>
  );
}
