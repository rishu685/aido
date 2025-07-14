import Head from "next/head";
import { MainNav } from "~/components/navbar";
import Chat from "~/components/chat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { Button } from "~/components/ui/button";
import { MessageSquare, Stethoscope, Brain } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from "src/components/3d/avatar1";
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
    const url = `/api/speech?text=${encodeURIComponent(msg)}`;
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
  }, [messageQueue, currentMessage]);

  return (
    <>
      <Head>
        <title>MediMind - Medical Queries</title>
        <meta
          name="description"
          content="Get reliable medical information and health advice from MediMind, your intelligent healthcare companion with interactive 3D guidance."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <div className="flex-1">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 43 }}>
            <color attach="background" args={["#f8fafc"]} />
            <OrbitControls />
            <Avatar currentMessage={currentMessage} groupConfig={groupConfig} />
            <Environment preset="apartment" />
            <Scene />
          </Canvas>
        </div>
        
        <div className="absolute left-0 top-0 w-full">
          <MainNav />
          <div className="flex-grow overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Medical Query Assistant
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                Get accurate medical information with trusted source citations
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Ask MediMind about symptoms, conditions, treatments, and general health questions. 
                All responses include references to authoritative medical sources.
              </p>
            </div>
          </div>
          
          <div className="fixed bottom-6 right-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 rounded-full px-6 py-3"
                >
                  <MessageSquare className="mr-2 h-5 w-5" /> 
                  Chat with MediMind
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mb-2 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-2 border-blue-200/50 dark:border-blue-700/50 shadow-2xl rounded-2xl">
                <Chat
                  type="Query"
                  botConversationTrigger={botConversationTrigger}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </main>
    </>
  );
}

const Scene = () => {
  const viewport = useThree((state) => state.viewport);
  const texture = useTexture("/assets/textures/background1.jpg");
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};