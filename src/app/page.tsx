import { Preloader } from "@/components/Preloader";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { SignatureDish } from "@/components/SignatureDish";
import { Menu } from "@/components/menu/Menu";
import { IngredientStory } from "@/components/IngredientStory";
import { ImmersiveBreak } from "@/components/ImmersiveBreak";
import { Kitchen } from "@/components/Kitchen";
import { DiningExperience } from "@/components/DiningExperience";
import { Location } from "@/components/location/Location";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { MotionOrchestrator } from "@/components/motion/MotionOrchestrator";

/**
 * Narrative order — from the sea to the table:
 * discover → senses → ingredient story → menu → desire → reservation
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="noi-dung">
        <Hero />
        <Manifesto />
        <SignatureDish />
        <Menu />
        <IngredientStory />
        <ImmersiveBreak />
        <Kitchen />
        <DiningExperience />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <MotionOrchestrator />
    </>
  );
}
