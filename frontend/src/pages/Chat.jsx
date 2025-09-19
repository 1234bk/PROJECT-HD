import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios"; // Assuming your axios instance is here
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

// A simple component for the bot's typing indicator
const TypingIndicator = () => (
  <div className="flex items-center justify-center space-x-1 p-3">
    <span className="h-2 w-2 bg-teal-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="h-2 w-2 bg-teal-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="h-2 w-2 bg-teal-500 rounded-full animate-pulse"></span>
  </div>
);

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Effect for auto-scrolling to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  // Initialize Web Speech API for voice input
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Automatically send after voice input for a smoother experience
        handleSend(transcript); 
      };

      recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  const handleVoice = () => {
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async (textToSend = input) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = { prompt: trimmedInput, response: "" };
    
    // Optimistically update UI with user's message
    setChat(prevChat => [...prevChat, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send the prompt and previous chat history for context
      const res = await api.post("/chat/ask", {
        prompt: trimmedInput,
        history: chat 
      });
      
      const botResponse = res.data.response;

      // Update the last message in the array with the bot's actual response
      setChat(prevChat => {
        const updatedChat = [...prevChat];
        updatedChat[updatedChat.length - 1].response = botResponse;
        return updatedChat;
      });

    } catch (err) {
      console.error("API Error:", err);
      // Show an error message directly in the chat
      setChat(prevChat => {
        const updatedChat = [...prevChat];
        updatedChat[updatedChat.length - 1].response = "**Error:** Sorry, I couldn't get a response. Please try again.";
        return updatedChat;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-teal-50 text-white font-sans">
     <button
            onClick={() => navigate("/")}
            className="fixed top-6 left-6 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2 px-4 rounded-lg shadow hover:scale-105 transition-transform duration-300 z-50"
          >
            <ArrowLeft size={20} />
            {/* <span className="font-semibold">Back</span> */}
          </button>
      <div className="max-w-3xl mx-auto mt-2 m-2 pl-2 pr-2 md:pl-0 md:pr-0 w-full flex flex-col h-full bg-white rounded-lg shadow-2xl">
        {/* Header */}
        <header className="bg-teal-500  text-white p-4 text-center text-2xl font-bold rounded-t-lg shadow-md">
          Skin Care Expert
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {chat.map((msg, idx) => (
            <div key={idx}>
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-teal-500 text-white p-4 rounded-xl max-w-lg break-words shadow-md">
                  {msg.prompt}
                </div>
              </div>

              {/* Bot Response */}
              {msg.response && (
                <div className="flex justify-start mt-2">
                  <div className="bg-white text-black p-4 rounded-xl max-w-lg break-words shadow-md border border-gray-200">
                    {/* Use ReactMarkdown to render the response correctly */}
                    <div className="prose prose-sm max-w-none">
  <ReactMarkdown>{msg.response}</ReactMarkdown>
</div>

                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Typing indicator appears here when loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-black p-2 rounded-xl shadow-md border border-gray-200">
                <TypingIndicator />
              </div>
            </div>
          )}
          
          {/* Invisible element to help with auto-scrolling */}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg flex items-center gap-3">
          <button
            className={`p-3 rounded-full transition-colors duration-200 ${listening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            onClick={handleVoice}
            aria-label="Use microphone"
          >
            <FaMicrophone size={20} />
          </button>
          <input
            type="text"
            className="flex-1 border-none rounded-lg p-3 bg-gray-100 text-black focus:ring-2 focus:ring-teal-500 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your skin care question..."
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
