"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSectionOriginal = () => {
  return (
    <section className="relative min-h-[90vh] bg-pink flex items-center justify-center px-4 safe-area-top">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Text content - Mobile Optimized */}
          <div className="text-center lg:text-left order-2 lg:order-1 mobile-px-4">
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
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
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

export default HeroSectionOriginal;