"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSectionWithWave = () => {
  return (
    <section className="relative min-h-[90vh] bg-pink flex items-center justify-center px-4 safe-area-top overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative">
          {/* Enhanced Diagonal Wavy Divider - Only visible on large screens */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main diagonal wave - more prominent */}
              <path
                d="M650 0 
                   C650 0, 580 100, 520 200
                   C460 300, 420 400, 480 500
                   C540 600, 620 700, 700 800
                   L1200 800
                   L1200 0
                   Z"
                fill="rgba(255, 255, 255, 0.4)"
                className="drop-shadow-lg"
              />
              {/* Secondary wave for depth */}
              <path
                d="M680 0 
                   C680 0, 610 120, 550 220
                   C490 320, 450 420, 510 520
                   C570 620, 650 720, 730 800
                   L1200 800
                   L1200 0
                   Z"
                fill="rgba(255, 255, 255, 0.2)"
                className="drop-shadow-md"
              />
              {/* Subtle accent wave */}
              <path
                d="M620 0 
                   C620 0, 550 80, 490 180
                   C430 280, 390 380, 450 480
                   C510 580, 590 680, 670 800
                   L1200 800
                   L1200 0
                   Z"
                fill="rgba(255, 255, 255, 0.1)"
              />
            </svg>
          </div>

          {/* Left side - Text content - Mobile Optimized */}
          <div className="text-center lg:text-left order-2 lg:order-1 mobile-px-4 relative z-20">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mb-2 md:mb-3 italic">
              Welcome to
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
              Soundous Bake Shop
            </h2>
            
            <div className="w-12 md:w-16 lg:w-24 h-0.5 bg-foreground mx-auto lg:mx-0 mb-4 md:mb-6"></div>
            
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-3 md:mb-4 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Where your sweetest dreams come to life through artisanal cake making and professional baking education.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From custom celebrations to hands-on workshops, we create memorable experiences one cake at a time.
            </p>

            {/* Three Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
              <Button 
                asChild 
                className="btn-primary text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-1"
              >
                <Link href="/custom">Order Custom Cake</Link>
              </Button>
              <Button 
                asChild 
                className="btn-outline text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-2"
              >
                <Link href="/workshops">Join Workshop</Link>
              </Button>
              <Button 
                asChild 
                className="btn-outline text-sm md:text-base font-medium rounded-lg w-full sm:w-auto order-3"
              >
                <Link href="/courses">Online Courses</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Image - Mobile Optimized */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 relative z-20">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              <img
                src="https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Beautiful custom cake"
                className="w-full h-auto rounded-lg soft-shadow"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionWithWave;