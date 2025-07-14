import { Mic, SendHorizontal, X, Sparkles, Bot } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "~/components/ui/textarea";
import { type AUTHOR, type CONVERSATION_TYPE } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

function Chat({
  type,
  botConversationTrigger,
}: {
  type: CONVERSATION_TYPE;
  botConversationTrigger: (msg: string) => void;
}) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      type: CONVERSATION_TYPE;
      author: AUTHOR;
      message: string;
    }[]
  >([]);

  const [followUp, setFollowUp] = useState<string[]>([]);

  // Mock data for demo purposes since we removed authentication
  const mockMessages = [
    {
      type: type,
      author: "bot" as AUTHOR,
      message: `Hello! I'm MediMind, your intelligent healthcare companion. How can I help you today?`,
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [type]);

  const handleFollowUpClick = async (followUpText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        author: "user",
        message: followUpText,
      },
    ]);
    await sendToApi({ message: followUpText, isFollowUp: false });
    setMessage(followUpText);
    setFollowUp([]);
    await sendToApi({
      message:
        "generate a list of possible follow up questions that the current user might come up with. Each item in the list should start with an asterisk.",
      isFollowUp: true,
    });
  };

  const handleSendToApi = async () => {
    try {
      await sendToApi({ message, isFollowUp: false });

      await sendToApi({
        message:
          "for the below message what can be the follow-up questions, give a list of possible questions that a user might come up with. Each item in the list should start with an asterisk." +
          messages[messages.length - 1]!.message,
        isFollowUp: true,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const translateText = async (text: string) => {
    try {
      const response = await fetch(
        `https://vertexai-api-ar2ndw3szq-uc.a.run.app/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            language: selectedLanguage,
          }),
        }
      );
      return await response.text();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendToApi = async ({
    message,
    isFollowUp,
  }: {
    message: string;
    isFollowUp: boolean;
  }) => {
    const context =
      "You are 'MediMind', a personal intelligent healthcare advisor. Your primary role is to provide accurate and reliable information in response to personal medical queries. You are knowledgeable about various medical topics and can offer advice based on trusted sources. When responding to queries, make sure to cite reliable sources that users can refer to for verification. For example, if a user asks, 'What are some common symptoms of a cold?' you can respond with: 'Hello! Common symptoms of a cold include a runny or stuffy nose, sneezing, sore throat, and mild body aches. You can verify this information from reputable sources such as the Centers for Disease Control and Prevention (CDC) or the Mayo Clinic.' Feel free to use authoritative medical sources such as medical journals, official health organizations, and well-known medical websites to back up your responses. Remember to prioritize accuracy, empathy, and the well-being of the users seeking medical information.";
    const followUpContext =
      "Consider the previous question asked by the user and generate a list of possible follow-up questions that the current user might come up with. Each item in the list should start with an asterisk.";

    try {
      const response = await fetch(
        `https://vertexai-api-ar2ndw3szq-uc.a.run.app/${type.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            context: isFollowUp ? followUpContext : context,
            history: messages.map((msg) => {
              return {
                author: msg.author,
                message: msg.message,
              };
            }),
          }),
        }
      );

      const text = await response.text();

      if (isFollowUp) {
        const translated = await translateText(text);
        setFollowUp(
          translated!
            .trim()
            .split("\n")
            .map((question) => question.trim().substring(2))
        );
      } else {
        const translatedText = await translateText(text);
        setMessages((prev) => [
          ...prev,
          {
            type,
            author: "bot",
            message: JSON.stringify(translatedText)!,
          },
        ]);
        botConversationTrigger(JSON.stringify(translatedText)!);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      (messagesEndRef.current as HTMLDivElement).scrollIntoView({
        behavior: "auto",
      });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const socketRef = useRef<WebSocket | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<
    "en-US" | "hi" | "ja"
  >("en-US");
  const [transcript, setTranscript] = useState<string[]>([]);

  async function transcribe() {
    console.log("Started transcription");
    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!MediaRecorder.isTypeSupported("audio/webm"))
          return alert("Browser not supported");
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        const webSocketUrl =
          selectedLanguage === "en-US"
            ? "wss://api.deepgram.com/v1/listen?model=nova"
            : `wss://api.deepgram.com/v1/listen?language=${selectedLanguage}`;

        const socket = new WebSocket(webSocketUrl, [
          "token",
          process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!,
        ]);

        socket.onopen = () => {
          console.log({ event: "onopen" });
          mediaRecorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0 && socket.readyState === 1) {
              socket.send(event.data);
            }
          });
          mediaRecorder.start(1000);
        };

        socket.onmessage = (message) => {
          const received = message && JSON.parse(message?.data as string);
          const transcript = received.channel?.alternatives[0]
            .transcript as string;
          setTranscript((prev) => {
            if (!prev.some((item) => item === transcript)) {
              return [...prev, transcript];
            }
            return prev;
          });
        };

        socket.onclose = () => {
          console.log({ event: "onclose" });
        };

        socket.onerror = (error) => {
          console.log({ event: "onerror", error });
        };

        socketRef.current = socket;
      });
  }

  useEffect(() => {
    if (isRecording) {
      console.log(transcript, "dusfh");

      setMessage("");
      transcribe();
    } else {
      console.log(transcript);
      setMessage(transcript.join(" "));
      setTranscript([]);
    }
  }, [isRecording]);

  return (
    <div className="w-[350px] max-w-xl flex-grow overflow-hidden p-1 lg:w-[450px]">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white">MediMind</h3>
          <p className="text-sm text-gray-300">Healthcare AI Assistant</p>
        </div>
        <div className="ml-auto">
          <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="mb-4 h-96 overflow-y-auto bg-gradient-to-b from-gray-800/30 to-gray-900/50 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm">
        {messages
          .filter((msg) => msg.type === type)
          .map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.author === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`${
                  msg.author === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-12 shadow-blue-500/25"
                    : "bg-gray-800/80 backdrop-blur-sm text-gray-100 mr-12 border border-gray-600/50 shadow-lg"
                } max-w-[85%] rounded-2xl p-4 shadow-xl`}
              >
                {msg.author === "bot" && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400">MediMind</span>
                  </div>
                )}
                <div
                  className={`text-sm leading-relaxed ${
                    msg.author === "user" ? "text-white" : ""
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.message.replace(/\n/g, "<br />"),
                  }}
                ></div>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Follow-up Questions */}
      {followUp.length != 0 && (
        <div className="no-scrollbar overflow-x-auto whitespace-nowrap border-t border-gray-600/30 py-3 mb-3">
          <div className="flex space-x-2">
            {followUp.map((followUpText, index) => (
              <button
                key={index}
                onClick={() => handleFollowUpClick(followUpText)}
                className="inline-block cursor-pointer rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 text-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-blue-400/30 whitespace-nowrap text-gray-200 hover:text-white backdrop-blur-sm"
              >
                {followUpText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="border-t border-gray-600/30 pt-4">
        <div className="flex items-end space-x-2 mb-3">
          <div className="flex-1">
            <Textarea
              style={{
                resize: "none",
              }}
              placeholder="Ask MediMind anything about your health..."
              className="rounded-xl border-2 border-gray-600/50 focus:border-blue-400 bg-gray-800/50 backdrop-blur-sm transition-all duration-200 text-gray-100 placeholder:text-gray-400"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
                  e.preventDefault();
                  setMessages((prev) => [
                    ...prev,
                    {
                      type,
                      author: "user",
                      message,
                    },
                  ]);
                  await handleSendToApi();
                }
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={async () => {
                if (isRecording) {
                  socketRef.current?.close();
                  await navigator.mediaDevices
                    .getUserMedia({ audio: true })
                    .then((stream) => {
                      stream.getTracks().forEach((track) => track.stop());
                    });
                  setIsRecording(false);
                } else {
                  setIsRecording(true);
                }
              }}
              className={`${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25"
              } rounded-full p-3 shadow-lg`}
            >
              {isRecording ? (
                <X className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={async () => {
                if (message.trim() !== "") {
                  setMessages((prev) => [
                    ...prev,
                    {
                      type,
                      author: "user",
                      message,
                    },
                  ]);
                  await sendToApi({ message, isFollowUp: false });
                }
              }}
              disabled={message.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full p-3 shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Language Selector */}
        <Select
          value={selectedLanguage}
          onValueChange={(value) => {
            setSelectedLanguage(value as "en-US" | "hi" | "ja");
          }}
        >
          <SelectTrigger className="w-full rounded-lg border-2 border-gray-600/50 focus:border-blue-400 bg-gray-800/50 backdrop-blur-sm text-gray-100">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="en-US">🇺🇸 English</SelectItem>
              <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
              <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Chat;