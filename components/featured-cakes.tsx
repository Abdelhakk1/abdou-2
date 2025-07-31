"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const FeaturedCakes = () => {
  const categories = [
    {
      id: 1,
      name: 'Custom Cakes',
      image: '/pics/346529C5-C88A-419E-9985-A05638AE15A0.jpeg',
      bgColor: 'bg-peach',
      link: '/custom'
    },
    {
      id: 2,
      name: 'Wedding Cakes',
      image: '/pics/wedding-cake-2.jpg',
      bgColor: 'bg-primary',
      link: '/wedding'
    },
    {
      id: 3,
      name: 'Workshop Creations',
      image: '/pics/3A4FF8E6-269F-4430-B424-E4E14404CC75.jpeg',
      bgColor: 'bg-lavender',
      link: '/workshops'
    },
    {
      id: 4,
      name: 'Online Courses',
      image: '/pics/EA4E7479-82AD-4D11-B8FA-1CC2C5089219.jpeg',
      bgColor: 'bg-mint',
      link: '/courses'
    }
  ];

  return (
    <section className="section-padding safe-area-left safe-area-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 custom-underline font-display">
            Our Specialties
          </h2>
        </div>

        {/* Mobile-First Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={category.link}
              className="group block hover-lift"
            >
              <div className={`${category.bgColor} rounded-lg overflow-hidden soft-shadow group-hover:elegant-shadow transition-all duration-300 h-full`}>
                {/* Consistent aspect ratio and padding */}
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="p-4 md:p-6 text-center">
                  {/* Updated arrow style */}
                  <div className="flex justify-center mb-3 md:mb-4">
                    <svg 
                      width="60" 
                      height="24" 
                      viewBox="0 0 60 24" 
                      fill="none" 
                      className="text-foreground group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path 
                        d="M40 4L52 12L40 20M52 12H8" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground underline font-display">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCakes;