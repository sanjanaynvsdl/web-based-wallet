import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <Container>
        <Hero />
      </Container>
      <Footer />
    </div>
  );
}
