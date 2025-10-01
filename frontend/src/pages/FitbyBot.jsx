import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa"; // Imported FaRobot and FaUser

const FitbyAI = () => {
  // Use a ref to scroll to the bottom of the chat window
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m FitbyAI, your fitness assistant. How can I help you achieve your goals today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessageContent = input;
    // Add user message immediately
    const newMessages = [...messages, { role: "user", content: userMessageContent }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat", // 🔗 your backend
        { message: userMessageContent }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "⚠️ Oops, something went wrong. Please check the server logs and try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    // Outer container for the entire chat component
    <div className="flex flex-col h-screen bg-gray-100 max-w-lg mx-auto shadow-2xl rounded-lg">
      
      {/* Header (Styling improved with a richer background and centered text) */}
      <div className="bg-[#ed6126] text-white py-4 px-6 font-extrabold text-xl shadow-md rounded-t-lg flex items-center justify-center">
        <FaRobot className="mr-3 text-2xl"/> 
        Fitby AI Assistant
      </div>

      {/* Chat Window (Fixed height and better padding) */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.role !== "user" && (
              <div className="flex-shrink-0 mr-3 mt-1 text-[#ed6126] text-xl">
                <FaRobot />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`px-4 py-3 max-w-[80%] text-sm shadow-md transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-[#ed6126] text-white rounded-t-2xl rounded-bl-2xl"
                  : "bg-gray-100 text-gray-800 rounded-t-2xl rounded-br-2xl border border-gray-200"
              }`}
            >
              {msg.content}
            </div>

            {/* User Avatar */}
            {msg.role === "user" && (
              <div className="flex-shrink-0 ml-3 mt-1 text-gray-500 text-xl">
                <FaUser />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start items-center">
             <div className="flex-shrink-0 mr-3 mt-1 text-[#ed6126] text-xl">
                <FaRobot />
              </div>
            <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-500 text-sm border border-gray-200">
              <span className="animate-pulse">FitbyAI is typing...</span>
            </div>
          </div>
        )}
        
        {/* Empty div for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box (Cleaned up and made sticky at the bottom) */}
      <div className="p-4 border-t border-gray-200 bg-white flex items-center rounded-b-lg sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          placeholder="Ask FitbyAI about workouts, diet, or fitness..."
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-[#ed6126] focus:border-transparent outline-none transition duration-150"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="ml-3 bg-[#ed6126] text-white p-3 rounded-full hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default FitbyAI;