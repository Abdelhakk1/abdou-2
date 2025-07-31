"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate newsletter signup
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/pics/black-and-white.jpg"
          alt="Baker decorating a large pink cake"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 katie-newsletter-overlay" />
      </div>

      <div className="relative z-10 katie-container w-full text-center">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 px-4">
          {/* Heading */}
          <h2 className="katie-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-display">
            Stay Connected With Us
          </h2>
          
          {/* Subtext */}
          <p className="katie-text text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
            Follow our journey and get updates on new creations, workshops, and baking tips.
          </p>
          
          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="katie-input flex-1 bg-white/95 border-white/20 text-katie-dark placeholder:text-katie-gray"
              disabled={isSubmitting}
            />
            <Button 
              type="submit"
              className="btn-katie-secondary bg-katie-blush text-katie-dark border-katie-blush hover:bg-katie-dark hover:text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>

          {/* Social Media Links - Fixed with proper styling */}
          <div className="pt-6 md:pt-8">
            <p className="text-white/90 mb-4 md:mb-6 text-sm md:text-base">Or connect with us on social media</p>
            <div className="flex justify-center space-x-4 md:space-x-6">
              <Button 
                size="icon" 
                className="bg-white hover:bg-white/90 text-gray-800 hover:text-gray-900 rounded-full h-14 w-14 md:h-16 md:w-16 transition-all duration-300 shadow-lg hover:shadow-xl" 
                asChild
              >
                <a 
                  href="https://www.instagram.com/soundous.bakes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6 md:h-7 md:w-7" />
                </a>
              </Button>
              <Button 
                size="icon" 
                className="bg-white hover:bg-white/90 text-gray-800 hover:text-gray-900 rounded-full h-14 w-14 md:h-16 md:w-16 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <a 
                  href="https://wa.me/213555123456" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Message us on WhatsApp"
                >
                  <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
                </a>
              </Button>
              <Button 
                size="icon" 
                className="bg-white hover:bg-white/90 text-gray-800 hover:text-gray-900 rounded-full h-14 w-14 md:h-16 md:w-16 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <a 
                  href="mailto:hello@soundousbakes.com"
                  aria-label="Send us an email"
                >
                  <Mail className="h-6 w-6 md:h-7 md:w-7" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Footer Brand */}
          <div className="pt-8 md:pt-12">
            <h3 className="katie-heading text-xl sm:text-2xl lg:text-3xl text-white/90 font-display">
              Soundous Bake Shop
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;