"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Users, Star } from 'lucide-react';

export default function About() {
  const timeline = [
    {
      year: '2018',
      title: 'The Sweet Beginning',
      description: 'Started baking from home kitchen, creating cakes for family and friends with love and passion',
      image: '/pics/black-and-white-2.jpg'
    },
    {
      year: '2019',
      title: 'First Professional Orders',
      description: 'Began taking custom cake orders and built a loyal local customer base through word of mouth',
      image: '/pics/graduation-cake-2.jpg'
    },
    {
      year: '2021',
      title: 'Workshop Launch',
      description: 'Started teaching cake decorating workshops to share knowledge and skills with fellow baking enthusiasts',
      image: '/pics/green-cake.jpg'
    },
    {
      year: '2023',
      title: 'Online Courses',
      description: 'Expanded to online courses, reaching students worldwide and building a global community',
      image: '/pics/purpel-cake.jpg'
    }
  ];

  const stats = [
    { icon: Heart, value: '500+', label: 'Happy Customers' },
    { icon: Award, value: '100+', label: 'Workshop Students' },
    { icon: Users, value: '50+', label: 'Online Course Students' },
    { icon: Star, value: '5.0', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen pt-18">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 gradient-text">
                About Soundous
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Passionate baker and cake artist dedicated to creating beautiful, delicious cakes that make every celebration special.
              </p>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                My journey began with a simple love for baking and a desire to bring joy to others through beautifully crafted cakes. Today, I specialize in custom cake designs, teach workshops, and offer online courses to help others discover their own passion for baking.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center group"
                  >
                    <div className="bg-primary/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden elegant-shadow max-w-md mx-auto lg:max-w-full">
                <img
                  src="/pics/hero-baking.png"
                  alt="Soundous in her bakery"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-8 soft-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 rounded-full p-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-foreground">5+ Years</div>
                    <div className="text-muted-foreground">of Experience</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
              My Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From humble beginnings in my home kitchen to teaching workshops and creating custom masterpieces.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-gradient-to-b from-primary to-primary/20 hidden lg:block" />

            <div className="space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1">
                    <Card className="border-0 soft-shadow hover:elegant-shadow transition-all duration-500 bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-10">
                        <div className="flex items-center mb-6">
                          <div className="bg-primary text-white rounded-full px-6 py-3 text-lg font-bold">
                            {item.year}
                          </div>
                        </div>
                        <h3 className="font-display text-2xl font-bold mb-4 text-foreground">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:block relative z-10">
                    <div className="w-6 h-6 bg-primary rounded-full elegant-shadow" />
                  </div>

                  <div className="flex-1">
                    <div className="relative rounded-2xl overflow-hidden soft-shadow hover:elegant-shadow transition-all duration-500">
                      <div className="aspect-[4/3] w-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/20 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
              My Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                To bring joy and sweetness to every celebration through beautifully crafted cakes and sharing the art of baking with others.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Through my workshops and online courses, I also aim to share my knowledge and passion with others, helping them discover the joy of baking and the satisfaction of creating something beautiful with their own hands.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}