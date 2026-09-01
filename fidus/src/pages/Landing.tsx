import { Link } from 'react-router-dom';
import { Shield, Star, Gavel, Briefcase, Wrench, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-deep-slate text-primary font-body flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-trust-blue" />
            <span className="font-heading text-2xl font-bold tracking-tight">Fidus</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-trust-blue transition-colors">
              Sign In
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-trust-blue/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h1 className="font-heading text-6xl sm:text-7xl font-extrabold tracking-tight">
              <span className="block text-trust-blue mb-2">Fidus</span>
              <span className="block text-white">Where Trust Meets Craft</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              The trustworthy service marketplace connecting clients with vetted artisans. Experience secure payments, intelligent trust scoring, and fair bidding.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/signup?role=Client" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full text-lg px-8 group shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all">
                  I Need a Service
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/signup?role=Artisan" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-lg px-8 hover:bg-surface transition-all">
                  I'm an Artisan
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-surface/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">Built on Trust and Transparency</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">Our core features ensure a secure and fair experience for everyone.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Escrow Feature */}
              <div className="bg-surface border border-border rounded-xl p-8 hover:border-emerald/50 transition-colors group">
                <div className="w-14 h-14 bg-emerald/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-emerald" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">Escrow Payments</h3>
                <p className="text-slate-400 leading-relaxed">
                  Funds are securely locked until the job is completed and both parties confirm. Total peace of mind for clients and guaranteed payment for artisans.
                </p>
              </div>

              {/* Trust Scoring Feature */}
              <div className="bg-surface border border-border rounded-xl p-8 hover:border-amber/50 transition-colors group">
                <div className="w-14 h-14 bg-amber/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-7 w-7 text-amber" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">Trust Scoring (WTA)</h3>
                <p className="text-slate-400 leading-relaxed">
                  Our proprietary Weighted Trust Algorithm ranks artisans based on verifiable job completions, authentic reviews, and strict KYC verification.
                </p>
              </div>

              {/* Transparent Bidding Feature */}
              <div className="bg-surface border border-border rounded-xl p-8 hover:border-trust-blue/50 transition-colors group">
                <div className="w-14 h-14 bg-trust-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Gavel className="h-7 w-7 text-trust-blue" />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">Transparent Bidding</h3>
                <p className="text-slate-400 leading-relaxed">
                  Post a job and watch vetted artisans compete fairly. Compare bids, review profiles, and choose the best professional for your specific needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white text-center mb-16">How Fidus Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Client Flow */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                  <Briefcase className="h-8 w-8 text-trust-blue" />
                  <h3 className="font-heading text-2xl font-bold text-white">For Clients</h3>
                </div>
                
                {[
                  "Post your job details and budget requirements.",
                  "Receive competitive bids from verified artisans.",
                  "Review artisan trust scores and select the best fit.",
                  "Fund the escrow securely to start the work.",
                  "Approve the completed job to release payment."
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-trust-blue/20 text-trust-blue font-bold flex items-center justify-center border border-trust-blue/30">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              {/* Artisan Flow */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
                  <Wrench className="h-8 w-8 text-emerald" />
                  <h3 className="font-heading text-2xl font-bold text-white">For Artisans</h3>
                </div>
                
                {[
                  "Complete KYC and build your professional profile.",
                  "Browse available jobs in your expertise area.",
                  "Submit competitive bids with estimated timelines.",
                  "Get hired and complete the work professionally.",
                  "Receive guaranteed payment and boost your trust score."
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald/20 text-emerald font-bold flex items-center justify-center border border-emerald/30">
                      {i + 1}
                    </div>
                    <p className="text-slate-300 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-trust-blue" />
            <span className="font-heading text-xl font-bold">Fidus</span>
          </div>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Fidus. Built for trust.
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
