import React from 'react';
import { Link } from '@tanstack/react-router';
import { Megaphone, CalendarDays, Users, ArrowRight, BookOpen, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NAV_CARDS = [
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Stay informed with the latest campus news, academic updates, and important notices from faculty and administration.',
    path: '/announcements',
    accent: 'bg-teal-50 border-teal-200',
    iconBg: 'bg-teal-700',
  },
  {
    icon: CalendarDays,
    title: 'Events',
    description: 'Discover upcoming campus events, workshops, social gatherings, and academic conferences happening near you.',
    path: '/events',
    accent: 'bg-cyan-50 border-cyan-200',
    iconBg: 'bg-cyan-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with students, faculty, and staff. Browse the campus directory and find people in your department.',
    path: '/community',
    accent: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-600',
  },
];

const FEATURES = [
  { icon: BookOpen, title: 'Academic Updates', desc: 'Get timely announcements from your departments and faculty.' },
  { icon: CalendarDays, title: 'Event Discovery', desc: 'Never miss a campus event with our comprehensive calendar.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Built on the Internet Computer with decentralized identity.' },
  { icon: Star, title: 'Community First', desc: 'A platform designed to bring the campus community together.' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-teal-800 min-h-[420px] flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/generated/campus-hero-banner.dim_1400x480.png')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-teal-700/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-cyan-400/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-400/30">
                <Star className="w-3 h-3 fill-cyan-300" />
                Your <span className="text-blue-300 mx-1">Campus</span> Hub
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Welcome to{' '}
              <span className="text-blue-400">Campus</span>
              <span className="text-green-400">Connect</span>
            </h1>
            <p className="text-teal-100 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
              Your central hub for campus announcements, events, and community connections. Stay informed, get involved, and thrive together.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold rounded-full px-8 shadow-lg"
              >
                <Link to="/announcements">
                  Explore Announcements
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 rounded-full px-8"
              >
                <Link to="/community">Meet the Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-teal-800 mb-3">
            Explore <span className="text-blue-500">Campus</span> <span className="text-green-500">Connect</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to stay connected with your campus community in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NAV_CARDS.map((card) => (
            <Link key={card.path} to={card.path} className="group block">
              <Card className={`h-full border-2 ${card.accent} shadow-card group-hover:shadow-card-hover transition-all duration-200 rounded-card group-hover:-translate-y-1`}>
                <CardContent className="pt-6 pb-6">
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 shadow-sm`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-teal-800 mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{card.description}</p>
                  <span className="inline-flex items-center text-sm font-semibold text-teal-700 group-hover:text-teal-600 transition-colors">
                    Explore {card.title}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-teal-50 border-y border-teal-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-teal-800 mb-2">
              Why <span className="text-blue-500">Campus</span> <span className="text-green-500">Connect</span>?
            </h2>
            <p className="text-muted-foreground">Built for the modern campus community.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-heading font-semibold text-teal-800 mb-1">{f.title}</h4>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
