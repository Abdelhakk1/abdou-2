"use client";

import { Button } from '@/components/ui/button';
import { Cake, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="section-padding bg-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 custom-underline">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Whether you need a custom cake or want to learn the art of baking, we're here to help you every step of the way
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group hover-lift">
            <div className="bg-white rounded-lg p-8 soft-shadow group-hover:elegant-shadow transition-all duration-300">
              <div className="bg-foreground/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Cake className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Order a Custom Cake</h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Let us create the perfect cake for your special occasion with attention to every detail.
              </p>
              <Button asChild className="btn-primary w-full">
                <Link href="/custom">Order Now</Link>
              </Button>
            </div>
          </div>

          <div className="text-center group hover-lift">
            <div className="bg-white rounded-lg p-8 soft-shadow group-hover:elegant-shadow transition-all duration-300">
              <div className="bg-foreground/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Join a Workshop</h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Learn hands-on cake making techniques in our intimate workshop settings.
              </p>
              <Button asChild className="btn-outline w-full">
                <Link href="/workshops">Book Workshop</Link>
              </Button>
            </div>
          </div>

          <div className="text-center group hover-lift">
            <div className="bg-white rounded-lg p-8 soft-shadow group-hover:elegant-shadow transition-all duration-300">
              <div className="bg-foreground/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Take Online Courses</h3>
              <p className="text-foreground/70 mb-6 leading-relaxed">
                Master cake decorating techniques from home with comprehensive tutorials.
              </p>
              <Button asChild className="btn-primary w-full">
                <Link href="/courses">View Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;