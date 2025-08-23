import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircleQuestion,
  Scale,
  MessageCircleX,
  SendHorizontal,
  ListRestart,
} from "lucide-react";
import chatBot from "../api/chatbot";

// Save encryption function using XOR with key
const encryptData = (data, secretKey) => {
  try {
    const jsonString = JSON.stringify(data);

    const textBytes = new TextEncoder().encode(jsonString);

    const keyBytes = new TextEncoder().encode(secretKey);

    // XOR each byte
    const encryptedBytes = new Uint8Array(textBytes.length);
    for (let i = 0; i < textBytes.length; i++) {
      encryptedBytes[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    // Convert the encrypted result to a Base64 string
    return btoa(String.fromCharCode(...encryptedBytes));
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

const decryptData = (encryptedData, secretKey) => {
  try {
    // Convert the Base64 string back to a bytes array
    const encryptedBytes = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Converts the key to a bytes array that repeats throughout the data
    const keyBytes = new TextEncoder().encode(secretKey);

    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    const jsonString = new TextDecoder().decode(decryptedBytes);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Decryption error:", error);
    return [];
  }
};

const ChatWidget = () => {
  const ENCRYPTION_KEY = "SERENA_SECRET_KEY_2025";

  // Storage key for localStorage
  const STORAGE_KEY = "serena_chat_messages";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick option buttons to show
  const quickOptions = [
    {
      icon: <MessageCircleQuestion color="#AC1754" />,
      text: "Apa itu Speak?",
      answer:
        "SPEAK adalah platform yang dirancang untuk membantu Pelapor pelecehan seksual melaporkan insiden, menerima bantuan konseling, dan meningkatkan kesadaran publik tentang masalah pelecehan seksual.",
    },
    {
      icon: <Scale color="#AC1754" />,
      text: "Dasar hukum",
      answer:
        "Dasar hukum untuk pelecehan seksual di Indonesia meliputi: KUHP Pasal 281-283, 289-296, 310-321, UU No. 23 Tahun 2004 tentang PKDRT, UU No. 21 Tahun 2007 tentang TPPO, UU No. 35 Tahun 2014 tentang Perlindungan Anak, dan UU No. 19 Tahun 2016 tentang ITE.",
    },
  ];

  // Load saved messages from localStorage
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        const encryptedMessages = localStorage.getItem(STORAGE_KEY);
        if (encryptedMessages) {
          const decryptedMessages = decryptData(
            encryptedMessages,
            ENCRYPTION_KEY
          );
          if (
            Array.isArray(decryptedMessages) &&
            decryptedMessages.length > 0
          ) {
            setMessages(decryptedMessages);
          }
        }
      } catch (error) {
        console.error("Error loading saved messages:", error);
      }
    };

    loadSavedMessages();
  }, []);

  // Save messages to localStorage every time messages changes
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const encryptedData = encryptData(messages, ENCRYPTION_KEY);
        localStorage.setItem(STORAGE_KEY, encryptedData);
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    }
  }, [messages]);

  const toggleChat = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to the chat
    const newMessages = [...messages, { sender: "user", text: inputMessage }];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const data = await chatBot.chat(inputMessage, messages);
      console.log("Response", data);

      // Add bot response to chat
      setMessages([
        ...newMessages,
        { sender: "bot", text: data?.message || "Tidak ada jawaban." },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Maaf, ada kesalahan dalam mengirim pesan. Coba lagi nanti.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (option) => {
    // Add user selection to messages
    const userMessage = { sender: "user", text: option.text };
    const botResponse = { sender: "bot", text: option.answer };

    setMessages([...messages, userMessage, botResponse]);
  };

  // Delete all chat history
  const clearChatHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Widget Button - Hidden when chat is open */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-16 h-16 sm:w-20 sm:h-20 flex justify-center items-center transition-all duration-300 ease-out group z-50 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="absolute -right-1 -top-1 z-10">
            <div className="flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-600 opacity-75" />
              <span className="relative inline-flex h-6 w-10 items-center justify-center rounded-full bg-[#AC1754] text-sm font-bold text-white">
                Hi!
              </span>
            </div>
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20">
            <img src="/images/chatbot.svg" alt="Chat bot" />
          </div>
          <span className="absolute inset-0 rounded-full scale-100 animate-pulse" />
          <div className="absolute right-full mr-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
            <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg">
              Ada yang bisa kubantu?
            </div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
          </div>
        </button>
      )}
      {/* Chat Popup */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-64 sm:w-80 md:w-96 shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Chat Header */}
        <div className="bg-[#AC1754] text-white p-3 sm:p-4 flex justify-between items-center">
          <h3 className="font-semibold bg-white text-[#AC1754] p-1 rounded text-sm sm:text-base">
            SERENA
          </h3>
          <div className="flex items-center space-x-2">
            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <button
                onClick={clearChatHistory}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none cursor-pointer"
                title="Hapus riwayat chat"
              >
                <ListRestart />
              </button>
            )}
            {/* Close Button */}
            <button
              onClick={toggleChat}
              className="text-white focus:outline-none cursor-pointer"
            >
              <MessageCircleX size={30} />
            </button>
          </div>
        </div>
        {/* Chat Messages Container */}
        <div className="bg-white h-80 sm:h-96 overflow-y-auto p-3 sm:p-4">
          {/* Quick Options Panel - Always visible */}
          <div className="space-y-2 mb-3 sm:mb-4">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuickOption(option)}
                className="flex items-center w-full p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <span className="mr-2 text-base sm:text-lg">
                  {React.cloneElement(option.icon, {
                    size: window.innerWidth < 450 ? 18 : 24,
                  })}
                </span>
                <span className="text-gray-700 font-medium text-xs sm:text-sm">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
          {/* Chat Messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 sm:mb-4 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-1 sm:py-2 px-2 sm:px-4 rounded-lg max-w-[175px] sm:max-w-xs text-xs sm:text-sm ${
                  message.sender === "user"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="mb-3 sm:mb-4 flex justify-start">
              <div className="py-1 sm:py-2 px-2 sm:px-4 rounded-lg bg-[#AC1754] text-white">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse delay-100"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          {/* Scroll reference */}
          <div ref={messagesEndRef} />
        </div>
        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          className="bg-gray-50 p-2 sm:p-3 flex items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Apa yang bisa saya bantu hari ini?"
            className="flex-1 border border-gray-300 rounded-l-lg p-1.5 sm:p-2 text-xs sm:text-sm focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-[#AC1754] text-white p-[6px] sm:p-[9px] rounded-r-lg cursor-pointer"
            disabled={isLoading}
          >
            <SendHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;
