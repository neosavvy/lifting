import { useNavigate } from 'react-router-dom'
import { GiWeightLiftingUp, GiStopwatch, GiNotebook } from 'react-icons/gi'
import { FaChartLine, FaMobileAlt, FaUsers } from 'react-icons/fa'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-matrix-dark text-matrix-green">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/arnold-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 animate-pulse">
              <span className="bg-matrix-green text-black px-4 py-2 rounded-full font-cyber text-sm">
                🏋️ Live at the Arnold Classic 2025! 🏋️
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-retro mb-6 text-matrix-green">
              Lift!
            </h1>
            <p className="text-xl md:text-2xl font-cyber mb-8 text-matrix-green/80">
              Your ultimate companion for the legendary 5/3/1 strength program.
              Track, progress, and dominate your lifts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/sign-up')}
                className="bg-matrix-green text-black px-8 py-4 rounded-lg font-cyber text-lg
                         hover:bg-matrix-green/90 transition-all transform hover:scale-105
                         shadow-lg shadow-matrix-green/20 animate-bounce"
              >
                Join Free During Arnold Classic! 🎉
              </button>
              <button
                onClick={() => navigate('/sign-in')}
                className="bg-transparent border-2 border-matrix-green text-matrix-green px-8 py-4 rounded-lg font-cyber
                         hover:bg-matrix-green/10 transition-all"
              >
                Returning User? Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<GiWeightLiftingUp size={40} />}
            title="Smart Plate Calculator"
            description="Never do plate math again. Get instant calculations for your working sets based on your training max."
          />
          <FeatureCard
            icon={<GiStopwatch size={40} />}
            title="AMRAP Tracking"
            description="Track your As Many Reps As Possible sets and see your progress over time."
          />
          <FeatureCard
            icon={<FaChartLine size={40} />}
            title="Progress Visualization"
            description="Watch your strength journey unfold with detailed progress tracking and analytics."
          />
          <FeatureCard
            icon={<GiNotebook size={40} />}
            title="Cycle Management"
            description="Automatically manage your training cycles and progressions. Focus on lifting, not planning."
          />
          <FeatureCard
            icon={<FaMobileAlt size={40} />}
            title="Mobile Optimized"
            description="Perfect for gym use. Access your workout plan anywhere, anytime."
          />
          <FeatureCard
            icon={<GiWeightLiftingUp size={40} />}
            title="Do Your Plate-math"
            description="Calculate your plates in pounds or kilos. Support for micro plates and non-standard weights."
          />
        </div>
      </div>

      {/* Arnold Classic Special */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-matrix-green/10 border border-matrix-green rounded-xl p-8 text-center">
          <h2 className="text-3xl font-retro mb-4">🏆 Arnold Classic 2025 Special Offer!</h2>
          <p className="font-cyber text-lg mb-6">
            Sign up for Lift! during the Arnold Classic and get unlimited access to all features!
            We're looking for feedback from serious lifters like you.
          </p>
          <div className="space-y-4">
            <p className="font-cyber text-matrix-green/80">
              ✓ Free Account Creation<br />
              ✓ All Premium Features Included<br />
              ✓ Early Access to New Features<br />
              ✓ Direct Line to Developers
            </p>
          </div>
          <button
            onClick={() => navigate('/sign-up')}
            className="mt-8 bg-matrix-green text-black px-8 py-4 rounded-lg font-cyber text-lg
                     hover:bg-matrix-green/90 transition-all transform hover:scale-105"
          >
            Create Your Free Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center font-cyber text-matrix-green/60">
        <p>Found us at the Arnold Classic? Say hi! We'd love your feedback.</p>
        <p className="mt-2">Contact us at <a href="mailto:aparrish@neosavvy.com" className="text-matrix-green hover:text-matrix-green/80">aparrish@neosavvy.com</a></p>
        <p className="mt-1 text-sm">(Please mention you found us at the Arnold Classic!)</p>
        <p className="mt-4">© 2025 Lift!</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="border border-matrix-green/30 rounded-xl p-6 hover:border-matrix-green/60 transition-colors">
      <div className="text-matrix-green mb-4">{icon}</div>
      <h3 className="text-xl font-retro mb-2">{title}</h3>
      <p className="font-cyber text-matrix-green/80">{description}</p>
    </div>
  )
} 