"use client";

import HeroSection from '@/components/hero-section';
import FeaturedCakes from '@/components/featured-cakes';
import WorkshopPreview from '@/components/workshop-preview';
import ExpertiseShowcase from '@/components/testimonials';
import NewsletterSection from '@/components/newsletter-section';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCakes />
      <WorkshopPreview />
      <ExpertiseShowcase />
      <NewsletterSection />
    </div>
  );
}