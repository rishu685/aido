import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "~/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatProps {
  type: "Query" | "Support";
  botConversationTrigger: (message: string) => Promise<void>;
}

const Chat: React.FC<ChatProps> = ({ type, botConversationTrigger }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getIntelligentResponse = (userMessage: string, chatType: string): string => {
    const message = userMessage.toLowerCase();
    
    if (chatType === "Support") {
      // Mental health support responses
      if (message.includes("anxious") || message.includes("anxiety")) {
        return "I understand you're feeling anxious. Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and can help calm anxiety. Would you like me to guide you through some other grounding techniques?";
      }
      if (message.includes("depressed") || message.includes("sad") || message.includes("down")) {
        return "I hear that you're going through a difficult time. Depression can feel overwhelming, but you're not alone. Small steps can make a difference - try to get some sunlight, stay hydrated, and reach out to someone you trust. Have you considered speaking with a mental health professional? I can help you find resources.";
      }
      if (message.includes("stress") || message.includes("overwhelmed")) {
        return "Feeling overwhelmed is a sign that you're carrying a lot right now. Let's break things down: What's the most pressing thing on your mind? Sometimes writing down your worries can help externalize them. Also, try progressive muscle relaxation - tense and release each muscle group starting from your toes.";
      }
      if (message.includes("sleep") || message.includes("insomnia")) {
        return "Sleep issues can significantly impact mental health. Try establishing a bedtime routine: no screens 1 hour before bed, keep your room cool and dark, and try some gentle stretching or meditation. Avoid caffeine after 2 PM. If this persists, consider consulting a healthcare provider.";
      }
      if (message.includes("panic") || message.includes("panic attack")) {
        return "Panic attacks are frightening but not dangerous. Try the 5-4-3-2-1 grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. Breathe slowly and remind yourself 'this will pass.' You're safe right now.";
      }
      return "Thank you for sharing with me. Your feelings are valid, and it takes courage to reach out. I'm here to support you. Can you tell me more about what's been on your mind lately? Remember, if you're having thoughts of self-harm, please contact a crisis helpline immediately.";
    } else {
      // Medical query responses
      if (message.includes("headache") || message.includes("head pain")) {
        return "Headaches can have various causes including dehydration, stress, eye strain, or tension. Try drinking water, resting in a dark room, and applying a cold or warm compress. If headaches are frequent, severe, or accompanied by other symptoms like fever, vision changes, or neck stiffness, please consult a healthcare provider.";
      }
      if (message.includes("fever") || message.includes("temperature")) {
        return "A fever is your body's natural response to infection. Stay hydrated, rest, and you can use acetaminophen or ibuprofen as directed. Seek immediate medical attention if fever exceeds 103°F (39.4°C), persists for more than 3 days, or is accompanied by severe symptoms like difficulty breathing or chest pain.";
      }
      if (message.includes("cough") || message.includes("cold")) {
        return "For a cough or cold, try staying hydrated, using a humidifier, honey for soothing (not for children under 1 year), and getting plenty of rest. See a doctor if symptoms worsen, persist beyond 10 days, or if you develop high fever, difficulty breathing, or chest pain.";
      }
      if (message.includes("stomach") || message.includes("nausea") || message.includes("vomit")) {
        return "For stomach issues, try the BRAT diet (bananas, rice, applesauce, toast), stay hydrated with small sips of water or electrolyte solutions, and avoid dairy and fatty foods. Seek medical care if you have severe dehydration, blood in vomit/stool, or severe abdominal pain.";
      }
      if (message.includes("pain") || message.includes("hurt")) {
        return "Pain management depends on the type and location. For minor aches, rest, ice/heat therapy, and over-the-counter pain relievers may help. However, persistent, severe, or worsening pain should be evaluated by a healthcare professional. Can you describe the location and nature of your pain?";
      }
      return "I understand you have a health concern. While I can provide general information, it's important to consult with a qualified healthcare provider for proper diagnosis and treatment. Can you describe your symptoms in more detail? Remember, if this is an emergency, please call emergency services immediately.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get intelligent response
      const responseText = getIntelligentResponse(inputValue, type);
      
      // Trigger voice synthesis
      await botConversationTrigger(responseText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
    }
  };

  return (
    <div className="flex flex-col h-96 w-80 bg-gray-900/95 backdrop-blur-lg border border-purple-400/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <h3 className="font-semibold text-lg">
          {type === "Support" ? "Mental Health Support" : "Medical Assistant"}
        </h3>
        <p className="text-sm opacity-90">
          {type === "Support" 
            ? "Share your feelings in a safe space" 
            : "Get medical information and guidance"
          }
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">👋 Hello! I'm here to help.</p>
            <p>
              {type === "Support" 
                ? "Feel free to share what's on your mind. I'm here to listen and support you."
                : "Ask me about symptoms, health concerns, or general medical questions."
              }
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-2xl text-sm",
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-800 text-gray-100 border border-gray-700"
              )}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                type === "Support" 
                  ? "Share your thoughts and feelings..." 
                  : "Describe your symptoms or ask a health question..."
              }
              className="min-h-[40px] max-h-[80px] resize-none bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col space-y-1">
            {/* Voice input button */}
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className={cn(
                "border-gray-600 hover:bg-gray-700",
                isListening && "bg-red-600 hover:bg-red-700 border-red-500"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            {/* Send button */}
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {recognitionRef.current && (
            <span className="flex items-center space-x-1">
              <Mic className="h-3 w-3" />
              <span>Voice input available</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;