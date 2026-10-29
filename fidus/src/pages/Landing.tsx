import { Link } from 'react-router-dom';
import { 
  Shield, 
  Gavel, 
  Briefcase, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-deep-slate text-primary font-body flex flex-col selection:bg-trust-blue selection:text-white">
      {/* Top Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-trust-blue/15 rounded-full blur-[140px]" />
        <div className="absolute top-[100px] left-1/4 w-[400px] h-[300px] bg-emerald/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/80 bg-surface/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-trust-blue/10 border border-trust-blue/30 flex items-center justify-center text-trust-blue group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-trust-blue" />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight text-white">
              Fidus<span className="text-trust-blue">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link 
              to="/login" 
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="shadow-lg shadow-trust-blue/20">
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-trust-blue/10 border border-trust-blue/30 text-trust-blue text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4" />
              <span>Decentralized Trust & Smart Escrow Marketplace</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Where Trust Meets <br />
              <span className="bg-gradient-to-r from-trust-blue via-blue-400 to-emerald bg-clip-text text-transparent">
                Exceptional Craft.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Connect with strictly vetted Nigerian artisans backed by guaranteed escrow protection, transparent bidding, and algorithmic reputation scoring.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link to="/signup?role=Client" className="w-full sm:w-auto">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full sm:w-auto text-base px-8 py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all font-semibold"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Hire an Artisan
                </Button>
              </Link>
              <Link to="/signup?role=Artisan" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-base px-8 py-3.5 border-border/80 hover:bg-surface/80 hover:border-emerald/40 transition-all font-semibold"
                >
                  <Wrench className="w-5 h-5 mr-2 text-emerald" />
                  Join as an Artisan
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald" /> 100% Escrow Protected
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-trust-blue" /> NIN & ID Verified Artisans
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber" /> Zero Payment Risk
              </span>
            </div>
          </div>

          {/* Interactive Escrow Mockup Card Preview */}
          <div className="mt-16 max-w-3xl mx-auto bg-surface/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 relative group hover:border-trust-blue/40 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-white text-lg">Solar Inverter Installation</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Escrow Funded
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">Job ID #FD-9842 • Ikeja, Lagos</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-text-muted">Escrow Amount</span>
                <div className="text-2xl font-heading font-black text-emerald">₦85,000</div>
              </div>
            </div>

            {/* Progress Stepper Visualizer */}
            <div className="py-6">
              <div className="text-xs font-semibold text-text-secondary mb-3 flex justify-between">
                <span>Escrow Milestone Status</span>
                <span className="text-emerald font-bold">Step 3 of 4: Work in Progress</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-2 rounded-full bg-emerald" />
                <div className="h-2 rounded-full bg-emerald" />
                <div className="h-2 rounded-full bg-trust-blue animate-pulse" />
                <div className="h-2 rounded-full bg-slate-800" />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] text-text-muted text-center">
                <span>1. Job Broadcast</span>
                <span>2. Escrow Locked</span>
                <span className="text-trust-blue font-bold">3. In Progress</span>
                <span>4. Payment Released</span>
              </div>
            </div>

            {/* Parties Footer */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald" />
                <span>Client: <strong>Chinedu O.</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald" />
                <span>Artisan: <strong>Ibrahim K. (WTA: 94.2)</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-y border-border/60 bg-surface/30 backdrop-blur-xs py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-white">₦15M+</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Secured in Escrow</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-emerald">100%</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Verified Artisans</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-trust-blue">4.9 / 5.0</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Average Client Rating</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-black text-amber">0%</div>
              <div className="text-xs sm:text-sm text-text-secondary mt-1">Payment Fraud Risk</div>
            </div>
          </div>
        </section>

        {/* Core Pillars Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Built on Uncompromising Trust
            </h2>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto">
              Traditional informal hiring in Africa suffers from payment disputes, abandoned projects, and unverified credentials. Fidus solves this systematically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Escrow Pillar */}
            <div className="bg-surface/60 border border-border/80 hover:border-emerald/50 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald/10 border border-emerald/20 rounded-2xl flex items-center justify-center mb-6 text-emerald group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">Locked Escrow Security</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Clients fund the project upfront into a neutral escrow vault. Funds are only disbursed once both client and artisan electronically sign off on completion.
              </p>
            </div>

            {/* WTA Score Pillar */}
            <div className="bg-surface/60 border border-border/80 hover:border-amber/50 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-amber/10 border border-amber/20 rounded-2xl flex items-center justify-center mb-6 text-amber group-hover:scale-110 transition-transform">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">Algorithmic Trust (WTA)</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Our Weighted Trust Algorithm calculates a transparent, tamper-proof score based on past job completion rates, client ratings, and verified credentials.
              </p>
            </div>

            {/* Transparent Bidding */}
            <div className="bg-surface/60 border border-border/80 hover:border-trust-blue/50 rounded-2xl p-8 transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 bg-trust-blue/10 border border-trust-blue/20 rounded-2xl flex items-center justify-center mb-6 text-trust-blue group-hover:scale-110 transition-transform">
                <Gavel className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">Transparent Bidding & Counters</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Receive itemized bids, compare proposed budgets, and negotiate counter-offers directly through the portal with full price transparency.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-trust-blue/20 via-surface to-emerald/20 border border-border/80 rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Experience Truly Reliable Services?
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
              Join thousands of clients and professional artisans building a safer, more transparent service economy across Africa.
            </p>
            <div className="pt-2">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="shadow-xl shadow-trust-blue/30 px-10">
                  Create Your Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-surface/40 py-12 px-4 sm:px-6 lg:px-8 mt-auto backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-trust-blue" />
            <span className="font-heading text-xl font-bold text-white">Fidus.</span>
          </div>
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} Fidus Platform. Built with integrity for the modern artisan economy.
          </p>
          <div className="flex gap-6 text-xs text-text-secondary font-medium">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
