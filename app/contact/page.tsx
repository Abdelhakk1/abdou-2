"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { contact } from '@/lib/contact';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      await contact.submitMessage(data);
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      setIsSubmitted(true);
      form.reset();
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: '+213 555 123 456',
      description: 'Call us for immediate assistance'
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@soundousbakes.com',
      description: 'Send us an email anytime'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: '123 Baker Street, Constantine, Algeria',
      description: 'Visit our workshop location'
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Tue-Sat: 10:00am-4:00pm',
      description: 'Sunday: Delivery only'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 custom-underline">
            Contact Us
          </h1>
          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Have a question or want to place an order? Get in touch with us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center">
                  <Send className="h-5 w-5 md:h-6 md:w-6 mr-3" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  /* Success State */
                  <div className="text-center py-8 md:py-12">
                    <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-600 mx-auto mb-4 md:mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">Message Sent Successfully!</h3>
                    <p className="text-foreground/70 mb-6 md:mb-8 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out! I'll get back to you within 24 hours. In the meantime, 
                      feel free to explore our workshops and courses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          form.reset();
                        }}
                        className="btn-outline w-full sm:w-auto"
                      >
                        Send Another Message
                      </Button>
                      <Button asChild className="btn-primary w-full sm:w-auto">
                        <a href="/workshops">View Workshops</a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Contact Form */
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Full Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your name" className="border-border focus:border-foreground h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your phone number" className="border-border focus:border-foreground h-12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Email *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" className="border-border focus:border-foreground h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Subject *</FormLabel>
                            <FormControl>
                              <Input placeholder="What can I help you with?" className="border-border focus:border-foreground h-12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-medium">Message *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell me about your project, questions, or how I can help you..."
                                className="min-h-[120px] md:min-h-[150px] border-border focus:border-foreground resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full btn-primary text-base md:text-lg py-4 md:py-6" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8">
            {/* Contact Details */}
            <Card className="soft-shadow bg-white border-0">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold text-foreground">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4">
                    <div className="bg-primary rounded-full p-2 md:p-3 flex-shrink-0">
                      <info.icon className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm md:text-base">{info.title}</h4>
                      <p className="text-foreground/80 font-medium text-sm md:text-base">{info.details}</p>
                      <p className="text-xs md:text-sm text-foreground/60">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Media - Updated with larger icons and only Instagram/WhatsApp */}
            <Card className="soft-shadow bg-pink border-0">
              <CardContent className="p-6 md:p-8 text-center">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6">Follow Our Journey</h3>
                <p className="text-sm md:text-base text-foreground mb-6 md:mb-8 leading-relaxed">
                  Stay updated with my latest creations, workshop announcements, and baking tips on social media.
                </p>
                <div className="flex justify-center space-x-4 md:space-x-6">
                  <Button 
                    size="icon" 
                    className="btn-primary rounded-full h-16 w-16 md:h-20 md:w-20" 
                    asChild
                  >
                    <a 
                      href="https://www.instagram.com/soundous.bakes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                    >
                      <Instagram className="h-7 w-7 md:h-9 md:w-9" />
                    </a>
                  </Button>
                  <Button 
                    size="icon" 
                    className="btn-primary rounded-full h-16 w-16 md:h-20 md:w-20"
                    asChild
                  >
                    <a 
                      href="https://wa.me/213555123456" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Message us on WhatsApp"
                    >
                      <MessageCircle className="h-7 w-7 md:h-9 md:w-9" />
                    </a>
                  </Button>
                  <Button 
                    size="icon" 
                    className="btn-primary rounded-full h-16 w-16 md:h-20 md:w-20"
                    asChild
                  >
                    <a 
                      href="mailto:hello@soundousbakes.com"
                      aria-label="Send us an email"
                    >
                      <Mail className="h-7 w-7 md:h-9 md:w-9" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="soft-shadow bg-primary/10 border-0">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-base md:text-lg font-bold text-foreground mb-4 md:mb-6">Quick Actions</h3>
                <div className="space-y-2 md:space-y-3">
                  <Button asChild className="w-full btn-outline justify-start text-sm md:text-base">
                    <a href="/custom">Order Custom Cake</a>
                  </Button>
                  <Button asChild className="w-full btn-outline justify-start text-sm md:text-base">
                    <a href="/workshops">Book Workshop</a>
                  </Button>
                  <Button asChild className="w-full btn-outline justify-start text-sm md:text-base">
                    <a href="/courses">Join Online Course</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="soft-shadow bg-pink border-0">
              <CardContent className="p-4 md:p-6 text-center">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-foreground mx-auto mb-3 md:mb-4" />
                <h4 className="font-bold text-foreground mb-2 text-sm md:text-base">Quick Response</h4>
                <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
                  We typically respond to all inquiries within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 md:mt-16">
          <Card className="soft-shadow bg-white border-0">
            <CardContent className="p-0">
              <div className="bg-pink h-48 md:h-64 flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin className="h-8 w-8 md:h-12 md:w-12 text-foreground mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Visit Our Workshop</h3>
                  <p className="text-foreground/70 text-sm md:text-base">123 Baker Street, Constantine, Algeria</p>
                  <p className="text-xs md:text-sm text-foreground/60 mt-2">
                    Free parking available behind our store. Please enter on Main Ave.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}