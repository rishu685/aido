import Head from "next/head";
import Link from "next/link";
import { MainNav } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Stethoscope, HeartPulse, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>MediMind - Your Intelligent Healthcare Companion</title>
        <meta
          name="description"
          content="MediMind is an award-winning AI healthcare assistant providing medical queries and mental health support with interactive 3D guidance."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <MainNav />
        
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
                  <Stethoscope className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              MediMind
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto">
              Your Intelligent Healthcare Companion
            </p>
            
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the future of healthcare with our award-winning AI assistant featuring 
              interactive 3D avatars, multilingual support, and personalized medical guidance.
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-12">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-medium">
                Winner of "Most Innovative Approach" at NivHack 2023
              </span>
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Medical Queries Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-6 shadow-lg shadow-blue-500/25">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Medical Queries</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Get accurate medical information with trusted source citations. Ask about symptoms, 
                  conditions, treatments, and general health questions.
                </p>
                
                <ul className="text-sm text-gray-400 mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Symptom analysis and guidance
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Treatment information with sources
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Interactive 3D male avatar
                  </li>
                </ul>
                
                <Link href="/query">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                    Start Medical Query
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mental Health Support Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 shadow-lg shadow-purple-500/25">
                  <HeartPulse className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Mental Health Support</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Receive compassionate mental health support, coping strategies, and emotional 
                  guidance in a safe, judgment-free environment.
                </p>
                
                <ul className="text-sm text-gray-400 mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Emotional support and coping strategies
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Relaxation and mindfulness techniques
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Interactive 3D female avatar
                  </li>
                </ul>
                
                <Link href="/support">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
                    Get Mental Health Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="text-2xl mb-3">🗣️</div>
                <h3 className="font-semibold text-white mb-2">Multilingual Support</h3>
                <p className="text-gray-400 text-sm">Chat in English, Hindi, or Japanese with voice and text support</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="text-2xl mb-3">🎭</div>
                <h3 className="font-semibold text-white mb-2">3D Avatars</h3>
                <p className="text-gray-400 text-sm">Interactive virtual characters with lip-sync and gestures</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <div className="text-2xl mb-3">🧠</div>
                <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-gray-400 text-sm">Advanced Google PaLM2 integration for accurate responses</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400">
            <p className="mb-2">Built with Next.js, Three.js, and Google Cloud</p>
            <p className="text-sm">Developed by t3-tribe team for NivHack 2023</p>
          </div>
        </div>
      </main>
    </>
  );
}