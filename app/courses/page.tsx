"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/auth-modal';
import { 
  PlayCircle, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  BookOpen,
  Star,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
// Removed supabase import - using API calls instead

export default function Courses() {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error('Failed to load courses');
      }
      
      const data = await response.json();
      
      // Parse JSON strings to objects if needed
      const formattedCourses = (data || []).map((course: any) => ({
        ...course,
        features: course.features || [],
        modules: course.modules || []
      }));
      
      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollClick = (courseId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Navigate to course detail page
    window.location.href = `/courses/${courseId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 custom-underline">
            Online Courses
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Master the art of cake making from the comfort of your home with our comprehensive online courses
          </p>
        </div>

        {/* Courses Grid - Mobile First */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
              {courses.map((course) => (
                <Card key={course.id} className="soft-shadow hover:elegant-shadow hover-lift transition-all duration-300 bg-white border-0">
                  <div className="relative">
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-40 md:h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-40 md:h-48 bg-gradient-to-br from-peach to-lavender rounded-t-lg flex items-center justify-center">
                        <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-foreground/50" />
                      </div>
                    )}
                    {course.discount_price && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs">
                        {Math.round(((course.price - course.discount_price) / course.price) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl font-bold text-foreground">{course.title}</CardTitle>
                    <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4 p-4 md:p-6 pt-0">
                    {/* Course Details - Mobile Optimized */}
                    <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-foreground/70">
                      {course.duration_hours && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          {course.duration_hours}+ hours
                        </div>
                      )}
                      {course.module_count && (
                        <div className="flex items-center">
                          <PlayCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          {course.module_count} modules
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Lifetime access
                      </div>
                      <div className="flex items-center">
                        <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                        Certificate
                      </div>
                    </div>

                    {/* Features - Mobile Optimized */}
                    {course.features && course.features.length > 0 && (
                      <div className="space-y-1 md:space-y-2">
                        {course.features.slice(0, 3).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-xs md:text-sm">
                            <CheckCircle className="h-2 w-2 md:h-3 md:w-3 text-green-600 mr-1 md:mr-2 flex-shrink-0" />
                            <span className="text-foreground/70">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pricing - Mobile Optimized */}
                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-foreground/10">
                      <div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <span className="text-lg md:text-2xl font-bold text-foreground">
                            {course.discount_price ? course.discount_price.toLocaleString() : course.price.toLocaleString()} DA
                          </span>
                          {course.discount_price && (
                            <span className="text-sm md:text-lg text-foreground/50 line-through">
                              {course.price.toLocaleString()} DA
                            </span>
                          )}
                        </div>
                        {course.discount_price && (
                          <p className="text-xs text-foreground/60">Limited time offer</p>
                        )}
                      </div>
                      <Button 
                        className="btn-primary text-sm md:text-base px-3 md:px-4 py-2"
                        onClick={() => handleEnrollClick(course.id)}
                      >
                        View Course
                        <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Empty State - Mobile Optimized */
          <Card className="soft-shadow bg-white border-0 text-center mb-12 md:mb-16">
            <CardContent className="p-8 md:p-16">
              <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-foreground/30 mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">No Courses Available</h3>
              <p className="text-foreground/70 mb-6 md:mb-8 max-w-md mx-auto">
                We're currently developing our online course content. Check back soon for exciting learning opportunities!
              </p>
              <Button asChild className="btn-primary w-full sm:w-auto">
                <Link href="/contact">Get Notified</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Features Section - Only show if there are courses - Mobile Optimized */}
        {courses.length > 0 && (
          <Card className="soft-shadow bg-yellow border-0 mb-12 md:mb-16">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12 custom-underline">
                Why Choose Our Courses?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <PlayCircle className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Video Tutorials</h3>
                  <p className="text-sm text-foreground/70">Step-by-step video lessons</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Community Support</h3>
                  <p className="text-sm text-foreground/70">Connect with fellow bakers</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Clock className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Lifetime Access</h3>
                  <p className="text-sm text-foreground/70">Learn at your own pace</p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Certificate</h3>
                  <p className="text-sm text-foreground/70">Completion certificate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonial - Only show if there are courses - Mobile Optimized */}
        {courses.length > 0 && (
          <Card className="soft-shadow bg-primary/10 border-0">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-base md:text-lg text-foreground/80 italic mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed">
                "The online courses are incredibly detailed and easy to follow. I've learned so much and can now create professional-looking cakes at home!"
              </p>
              <div className="text-sm text-foreground/60">
                - Fatima Boudjemaa, Course Graduate
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
}