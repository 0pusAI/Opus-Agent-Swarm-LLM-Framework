import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { BeehiveBrain } from "@/components/BeehiveBrain";
import { Architecture } from "@/components/Architecture";
import { TechStack } from "@/components/TechStack";
import { LiveSwarm } from "@/components/LiveSwarm";
import { GreatWork } from "@/components/GreatWork";
import { BuildLog } from "@/components/BuildLog";
import { Autogenesis } from "@/components/Autogenesis";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <BeehiveBrain />
      <Architecture />
      <LiveSwarm />
      <GreatWork />
      <BuildLog />
      <Autogenesis />
      <CallToAction />
      <TechStack />
      <Footer />
    </main>
  );
}
