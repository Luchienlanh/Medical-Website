import React from "react";
import { Header } from "../../components/HeaderFooter/TSX/Header";
import { Hero } from "../../components/LandingPage/TSX/Hero";
import { About } from "../../components/LandingPage/TSX/About";
import { Choice } from "../../components/LandingPage/TSX/Choice";
import { WhyChoice } from "../../components/LandingPage/TSX/whyChoice";
import { Certification } from "../../components/LandingPage/TSX/Certification";
import { Feedback } from "../../components/LandingPage/TSX/Feedback";
import { Footer } from "../../components/HeaderFooter/TSX/Footer";
import { PageContainer } from "../../components/Animation/PageContainer";
function LandingPage() {
  return (
    <>
      <Header />
      <PageContainer>
        <Hero />
        <About />
        <Choice />
        <WhyChoice />
        <Certification />
        <Feedback />
      </PageContainer>
      <Footer />
    </>
  );
}

export default LandingPage;
