"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, ChevronRight, Globe, MessageSquare, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Homepage() {

  const features = [
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Showcase Travel Deals",
      description: "Upload and promote your best travel packages directly to other travel professionals."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Targeted Advertisements",
      description: "Create and manage ads specifically designed for the B2B travel market."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Direct Communication",
      description: "Connect directly with potential partners and generate quality leads."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Exclusive Network",
      description: "Access a secure platform exclusively for verified travel agents."
    }
  ];

  const howItWorks = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Register and verify your travel agency credentials."
    },
    {
      number: "02",
      title: "List Your Deals",
      description: "Upload your best travel packages and promotions."
    },
    {
      number: "03",
      title: "Connect & Grow",
      description: "Network with other agents and expand your business."
    }
  ];

  const testimonials = [
    {
      text: "Travelisting transformed how we collaborate with other agencies. Our network has grown 300% in just 6 months.",
      author: "Sarah Johnson",
      company: "Horizon Travel Solutions"
    },
    {
      text: "The platform's B2B focus means every connection is relevant. We've closed more deals in less time.",
      author: "Michael Chen",
      company: "Pacific Tour Partners"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center">
                  <Image src="/logo.jpg" height={40} width={40} alt="Travelisting Logo" />
                  <span className="ml-2 text-xl font-semibold text-primary">Travelisting</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* <Link href="/about" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                About
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md">
                Contact
              </Link> */}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gold-100 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                The Ultimate B2B Platform for <span className="text-primary">Travel Agents</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Connect with other travel professionals, showcase your deals, and grow your business network. Exclusively designed for travel agents.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Join the Network
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-gray-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden ">
                <Image 
                  src="/images/networkingImage.png" 
                  width={600} 
                  height={400} 
                  alt="Travel Agents Networking"
                  className="w-full object-cover" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Travel Professionals</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to showcase your offerings and connect with other travel agents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-primary/10 inline-flex rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Travelisting Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in just three simple steps and begin growing your travel business network.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-xl shadow-sm relative z-10 h-full">
                  <div className="text-4xl font-bold text-primary mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-0">
                    <ChevronRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Travel Professionals</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Hear what other travel agents are saying about their experience with Travelisting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Expand Your Travel Business Network?</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of travel professionals already using Travelisting to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Register Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gold-100 pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            {/* Logo Column */}
            <div className="w-full md:w-1/4 flex items-center justify-center md:justify-start mb-8 md:mb-0">
              <Link href="/" className="flex items-center text-gray-900">
                <Image src="/logo.jpg" alt="logo" height={98} width={98} />
              </Link>
            </div>

            {/* Navigation Links Columns */}
            <div className="w-full md:w-3/4 flex justify-center md:justify-end">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900 tracking-widest text-sm mb-3">COMPANY</h2>
                  <nav className="list-none mb-10">
                    <li className="mb-2">
                      <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/terms" className="text-gray-600 hover:text-gray-800">Terms & Conditions</Link>
                    </li>
                    <li className="mb-2">
                      <Link href="/blog" className="text-gray-600 hover:text-gray-800">Blog</Link>
                    </li>
                  </nav>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900 tracking-widest text-sm mb-3">CONTACT</h2>
                  <nav className="list-none mb-10">
                    <li className="mb-2">
                      <a href="tel:+917840079095" className="text-gray-600 hover:text-gray-800">India: +91-78400 79095</a>
                    </li>
                    <li className="mb-2">
                      <a href="tel:+911204994499" className="text-gray-600 hover:text-gray-800">India: +91-120-4994499</a>
                    </li>
                    <li className="mb-2">
                      <a href="mailto:info@gennextit.com" className="text-gray-600 hover:text-gray-800">info@gennextit.com</a>
                    </li>
                  </nav>
                </div>
                <div className="flex flex-col">
                  <h2 className="font-medium text-gray-900 tracking-widest text-sm mb-3">ADDRESS</h2>
                  <nav className="list-none mb-10">
                    <li className="mb-2">
                      <p className="text-gray-600">Basement (C-001), Building H-53</p>
                    </li>
                    <li className="mb-2">
                      <p className="text-gray-600">Sector 63, Noida (UP)-201305, India</p>
                    </li>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6">
            <p className="text-sm text-gray-500 text-center">© {new Date().getFullYear()} Travelisting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}