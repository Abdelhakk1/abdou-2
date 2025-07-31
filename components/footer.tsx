"use client";

import Link from 'next/link';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-pink section-padding safe-area-bottom safe-area-left safe-area-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Instagram Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="text-2xl sm:text-3xl font-script text-foreground mb-4">
            Soundous
          </div>
          <div className="text-xs sm:text-sm font-medium text-foreground tracking-[0.2em] uppercase mb-6 md:mb-8">
            BAKE SHOP
          </div>
          
          <div className="text-base sm:text-lg text-foreground mb-4 md:mb-6">@soundous.bakes</div>
          
          <Button 
            variant="outline" 
            className="btn-outline mb-8 md:mb-12"
            asChild
          >
            <a href="https://www.instagram.com/soundous.bakes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              Follow on Instagram
            </a>
          </Button>

          {/* Instagram Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8 md:mb-12">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/black-and-white-2.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/wedding-cake-2.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/green-cake.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/purpel-cake.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/black-and-white-2.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/wedding-cake-2.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/green-cake.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <img src="/pics/purpel-cake.jpg" alt="Instagram post" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Footer Info - Mobile optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 text-center sm:text-left">
          {/* Location */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6 font-display">Location</h3>
            <div className="text-foreground/80 space-y-2 text-sm md:text-base">
              <p>123 Baker Street</p>
              <p>Constantine, Algeria</p>
              <p className="mt-4 text-xs md:text-sm">
                Free parking available
              </p>
              <p className="text-xs md:text-sm">
                Please enter on Main Ave
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6 font-display">Hours</h3>
            <div className="text-foreground/80 space-y-2 text-sm md:text-base">
              <p className="font-medium">Tuesday - Saturday</p>
              <p>10:00am-4:00pm</p>
              <p className="font-medium mt-4">Sunday</p>
              <p>Delivery Only</p>
              <p>No retail hours</p>
              <p className="text-xs md:text-sm">Order in advance</p>
            </div>
          </div>

          {/* Contact & Connect */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6 font-display">Contact</h3>
            <div className="text-foreground/80 space-y-2 text-sm md:text-base mb-6">
              <p>hello@soundousbakes.com</p>
              <p>+213 555 123 456</p>
            </div>
            
            <h4 className="text-base md:text-lg font-bold text-foreground mb-4 font-display">Connect With Us</h4>
            <div className="flex justify-center sm:justify-start space-x-4">
              <Button size="icon" variant="ghost" className="text-foreground hover:text-foreground/70 h-12 w-12" asChild>
                <a href="https://www.instagram.com/soundous.bakes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="text-foreground hover:text-foreground/70 h-12 w-12" asChild>
                <a href="https://wa.me/213555123456" target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp">
                  <MessageCircle className="h-6 w-6" />
                </a>
              </Button>
              <Button size="icon" variant="ghost" className="text-foreground hover:text-foreground/70 h-12 w-12" asChild>
                <a href="mailto:hello@soundousbakes.com" aria-label="Send us an email">
                  <Mail className="h-6 w-6" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-foreground/20">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6 md:mb-8">
            <Link href="/" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              About
            </Link>
            <Link href="/custom" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Custom Cakes
            </Link>
            <Link href="/workshops" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Workshops
            </Link>
            <Link href="/courses" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Online Courses
            </Link>
            <Link href="/gallery" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Gallery
            </Link>
            <Link href="/contact" className="text-foreground hover:text-foreground/70 transition-colors text-sm md:text-base font-medium">
              Contact
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-foreground/60 text-xs md:text-sm">
            © 2024 Soundous Bake Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;