import Head from "next/head";
import { MainNav } from "~/components/navbar";
import Chat from "~/components/chat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { Button } from "~/components/ui/button";
import { MessageSquare, HeartPulse } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from "src/components/3d/avatar2";
import axios from "axios";
import { useEffect, useState } from "react";

interface MessageQueue {
  lipSync: object;
  audio: HTMLAudioElement;
}

export default function Home() {
  const groupConfig = {
    position: [0, -3, 5],
    scale: 2,
  };
  const [messageQueue, setMessageQueue] = useState<MessageQueue[]>([]);
  const botConversationTrigger = async (msg: string) => {
    const url = `/api/speech?text=${encodeURIComponent(msg)}&gender=f`;
    const blob = await (await fetch(url)).blob();
    const audio = new Audio(URL.createObjectURL(blob));
    const formData = new FormData();
    formData.append("audio", new Blob([blob], { type: "audio/mpeg" }));

    const { data } = await axios.post(
      "https://vertexai-api-ar2ndw3szq-uc.a.run.app/convertToSpeech",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setMessageQueue((prev) => [{ lipSync: data, audio: audio }, ...prev]);
  };

  const [currentMessage, setCurrentMessage] = useState<MessageQueue | null>(
    null
  );

  useEffect(() => {
    if (!currentMessage && messageQueue.length > 0) {
      const { audio, lipSync } = messageQueue[0]!;
      setCurrentMessage({ audio, lipSync });

      audio.addEventListener("ended", () => {
        setCurrentMessage(null);
        setMessageQueue((prev) => prev.slice(1));
      });
    }
    if (
      currentMessage?.audio &&
      currentMessage.audio.ended &&
      messageQueue.length > 0
    ) {
      const { audio, lipSync } = messageQueue[0]!;
      setCurrentMessage({ audio, lipSync });
      audio.addEventListener("ended", () => {
        setCurrentMessage(null);
        setMessageQueue((prev) => prev.slice(1));
      });
    }
  }, [messageQueue]);

  return (
    <>
      <Head>
        <title>MediMind - Mental Health Support</title>
        <meta
          name="description"
          content="Get mental health support, coping strategies, and emotional guidance from MediMind, your compassionate AI healthcare companion."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-gray-900 via-purple-900/30 to-pink-900/30">
        <div className="flex-1">
          <Canvas 
            shadows 
            camera={{ position: [0, 0, 8], fov: 43 }}
            fallback={<div className="flex items-center justify-center h-full text-white">Loading 3D Avatar...</div>}
          >
            <color attach="background" args={["#1e1b4b"]} />
            <OrbitControls />
            <React.Suspense fallback={null}>
              <Avatar currentMessage={currentMessage} groupConfig={groupConfig} />
            </React.Suspense>
            <Environment preset="apartment" />
            <Scene />
          </Canvas>
        </div>
        
        <div className="absolute left-0 top-0 w-full">
          <MainNav />
          <div className="flex-grow overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl shadow-purple-500/25">
                  <HeartPulse className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Mental Health Support
              </h1>
              <p className="text-xl text-gray-200 mb-3">
                Compassionate support for your mental wellness journey
              </p>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Share your feelings with MediMind and receive coping strategies, relaxation techniques, 
                and emotional support in a safe, judgment-free environment.
              </p>
            </div>
          </div>
          
          <div className="fixed bottom-6 right-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-110 transition-all duration-300 rounded-full px-8 py-4 text-lg border border-purple-400/20"
                >
                  <MessageSquare className="mr-2 h-5 w-5" /> 
                  Talk to MediMind
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mb-2 w-full bg-gray-900/95 backdrop-blur-lg border-2 border-purple-400/30 shadow-2xl shadow-purple-500/10 rounded-2xl">
                <Chat
                  type="Support"
                  botConversationTrigger={botConversationTrigger}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}

const Scene = () => {
                }
  )
  const viewport = useThree((state) => state.viewport);
  // Create a simple gradient background instead of loading texture
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial color="#1e1b4b" />
    </mesh>
  );
};