"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Clock, Heart, Cake, BookOpen } from 'lucide-react';
import Link from 'next/link';

const ExpertiseShowcase = () => {
  const achievements = [
    {
      id: 1,
      icon: Cake,
      number: '500+',
      title: 'Custom Cakes Created',
      description: 'Beautiful custom cakes for every special occasion',
      image: '/pics/black-and-white-2.jpg'
    },
    {
      id: 2,
      icon: Users,
      number: '150+',
      title: 'Students Trained',
      description: 'Passionate bakers who learned with us',
      image: '/pics/wedding-cake-2.jpg'
    },
    {
      id: 3,
      icon: Clock,
      number: '5+',
      title: 'Years of Experience',
      description: 'Dedicated to perfecting the art of baking',
      image: '/pics/green-cake.jpg'
    },
    {
      id: 4,
      icon: Award,
      number: '100%',
      title: 'Satisfaction Rate',
      description: 'Happy customers and successful students',
      image: '/pics/purpel-cake.jpg'
    }
  ];

  const specialties = [
    {
      title: 'Wedding Cakes',
      description: 'Elegant and stunning wedding cakes that make your special day unforgettable',
      image: '/pics/wedding-cake-2.jpg'
    },
    {
      title: 'Custom Themes',
      description: 'Personalized cake designs that bring your unique vision to life',
      image: '/pics/black-and-white-2.jpg'
    },
    {
      title: 'Professional Training',
      description: 'Comprehensive workshops and courses for aspiring bakers',
      image: '/pics/3A4FF8E6-269F-4430-B424-E4E14404CC75.jpeg'
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Achievements Section - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 custom-underline font-display">
            Our Achievements
          </h2>
          <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Years of dedication to excellence in baking and education
          </p>
        </div>

        {/* Mobile-First Grid - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white text-center">
              <CardContent className="p-6 md:p-8">
                <div className="bg-primary/10 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <achievement.icon className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">{achievement.number}</div>
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 md:mb-3 font-display">{achievement.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Specialties Section - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6 custom-underline font-display">
            Our Specialties
          </h2>
          <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            What makes us different from other baking schools
          </p>
        </div>

        {/* Mobile-First Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {specialties.map((specialty, index) => (
            <Card key={index} className="overflow-hidden soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white h-full">
              <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={specialty.image}
                    alt={specialty.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-1 font-display">{specialty.title}</h3>
                </div>
              </div>
              <CardContent className="p-4 md:p-6">
                <p className="text-foreground/80 leading-relaxed text-sm md:text-base">{specialty.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action - Mobile Optimized */}
        <Card className="soft-shadow bg-pink border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <Heart className="h-8 w-8 md:h-12 md:w-12 text-foreground mx-auto mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6 font-display">
              Ready to Create Something Sweet?
            </h2>
            <p className="text-base md:text-lg text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you need a custom cake for your special event or want to learn professional baking techniques, we're here to help make your sweet dreams come true.
            </p>
            {/* Mobile-First Button Layout */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button asChild className="btn-primary px-6 md:px-8 py-3 w-full sm:w-auto">
                <Link href="/custom">Order Custom Cake</Link>
              </Button>
              <Button asChild className="btn-outline px-6 md:px-8 py-3 w-full sm:w-auto">
                <Link href="/workshops">Join Workshop</Link>
              </Button>
              <Button asChild className="btn-outline px-6 md:px-8 py-3 w-full sm:w-auto">
                <Link href="/courses">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Online Courses
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ExpertiseShowcase;