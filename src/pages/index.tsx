import Head from "next/head";
import Link from "next/link";
import { MainNav } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Bot, HeartPulse, MessagesSquare, PersonStanding, Sparkles, Shield, Globe } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: <Bot size={50} className="text-blue-500" />,
      featureName: "Reliable Bot for Personal Medical Queries",
      shortDescription:
        "Access a reliable bot to answer personal medical queries and provide citations from trusted sources.",
    },
    {
      icon: <HeartPulse size={50} className="text-red-500" />,
      featureName: "Mental Health Support and Coping Strategies",
      shortDescription:
        "Receive mental health support through coping strategies, relaxation techniques, and personal companionship.",
    },
    {
      icon: <PersonStanding size={50} className="text-green-500" />,
      featureName: "Personalised 3D Characters & Voice Support",
      shortDescription:
        "Experience personalization with animated 3D characters and local language voice support.",
    },
    {
      icon: <Sparkles size={50} className="text-purple-500" />,
      featureName: "AI-Powered Insights",
      shortDescription:
        "Get intelligent health insights powered by advanced AI technology for better healthcare decisions.",
    },
    {
      icon: <Shield size={50} className="text-orange-500" />,
      featureName: "Privacy & Security",
      shortDescription:
        "Your health data is protected with enterprise-grade security and complete privacy assurance.",
    },
    {
      icon: <Globe size={50} className="text-teal-500" />,
      featureName: "Multi-Language Support",
      shortDescription:
        "Communicate in your preferred language with support for multiple languages and dialects.",
    },
  ];

  return (
    <>
      <Head>
        <title>MediMind - Your Intelligent Healthcare Companion</title>
        <meta
          name="description"
          content="Your all-in-one solution for personalized health recommendations, reliable medical insights, mental health support, and interactive 3D character guidance. Available in local languages for a truly personalized experience."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-purple-900">
        <MainNav />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-purple-900/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full blur-xl opacity-30 animate-ping"></div>
                  <Image
                    src="/medical-logo.svg"
                    width={140}
                    height={140}
                    className="relative rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-500"
                    alt="MediMind Logo"
                  />
                </div>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse">
                MediMind
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-200 mb-4 max-w-3xl mx-auto font-light">
                Your Intelligent Healthcare Companion
              </p>
              
              <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get personalized health insights, mental health support, and medical guidance 
                through our advanced AI-powered platform with interactive 3D characters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link href="/query">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 text-xl rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 border border-blue-400/20">
                    <MessagesSquare className="mr-2" size={20} />
                    Ask MediMind
                  </Button>
                </Link>

                <Link href="/support">
                  <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-500 hover:text-white px-10 py-5 text-xl rounded-full shadow-2xl hover:shadow-purple-500/25 transform hover:scale-110 transition-all duration-300 bg-purple-500/10 backdrop-blur-sm">
                    <HeartPulse className="mr-2" size={20} />
                    Mental Health Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover how MediMind can transform your healthcare experience with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                className="group relative bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/10 transform hover:scale-105 transition-all duration-500 border border-gray-700/50 hover:border-blue-500/30"
                key={feature.featureName}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 border border-blue-400/20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                    {feature.featureName}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.shortDescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-500/10 to-transparent"></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="relative text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Start Your Health Journey?
            </h2>
            <p className="relative text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust MediMind for their healthcare needs. 
              Start your conversation today and experience the future of healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/query">
                <Button size="lg" className="relative bg-white/90 backdrop-blur-sm text-blue-600 hover:bg-white px-10 py-5 text-xl rounded-full shadow-2xl hover:shadow-white/25 transform hover:scale-110 transition-all duration-300 border border-white/20">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}