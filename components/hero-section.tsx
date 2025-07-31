"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative bg-pink px-4 pt-16 pb-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Text */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-2 md:mb-3 italic">
              Welcome to
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight font-display">
              Soundous Bake Shop
            </h2>

            <div className="w-12 md:w-16 lg:w-24 h-0.5 bg-foreground mx-auto lg:mx-0 mb-4 md:mb-6"></div>

            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-3 md:mb-4 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Where your sweetest dreams come to life through artisanal cake making and professional baking education.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From custom celebrations to hands-on workshops, we create memorable experiences one cake at a time.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="btn-primary text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-1"
              >
                <Link href="/custom">Order Custom Cake</Link>
              </Button>
              <Button
                asChild
                className="btn-primary text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-2"
              >
                <Link href="/wedding">Order Wedding Cake</Link>
              </Button>
              <Button
                asChild
                className="btn-outline text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-3"
              >
                <Link href="/workshops">Join Workshop</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Framed Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-[460px] sm:w-[480px] md:w-[520px] lg:w-[540px] xl:w-[560px] h-[75vh]">
              <img
                src="/pics/hero-baking.png"
                alt="Beautiful custom cake"
                className="w-full h-full object-cover object-center rounded-xl soft-shadow hover:elegant-shadow transition-all duration-300"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-foreground text-background py-3 overflow-hidden whitespace-nowrap">
        <div className="flex">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4 text-sm md:text-base tracking-wider">ARTISANAL CAKE MAKING</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">PROFESSIONAL BAKING EDUCATION</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">CUSTOM CELEBRATIONS</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">WEDDING CAKES</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">HANDS-ON WORKSHOPS</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">MEMORABLE EXPERIENCES</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
          </div>
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4 text-sm md:text-base tracking-wider">ARTISANAL CAKE MAKING</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">PROFESSIONAL BAKING EDUCATION</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">CUSTOM CELEBRATIONS</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">WEDDING CAKES</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">HANDS-ON WORKSHOPS</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">MEMORABLE EXPERIENCES</span>
            <span className="mx-4 text-sm md:text-base tracking-wider">•</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;