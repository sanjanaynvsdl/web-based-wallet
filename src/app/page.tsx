import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { NavBar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Container>
        <NavBar />
        <Hero />
      </Container>
    </div>
  );
}
