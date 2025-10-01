import React, { useState, useRef } from "react"; 
import axios from "axios";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";

const FitbyAI = () => {
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m FitbyAI, your fitness assistant. How can I help you achieve your goals today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // The scrollToBottom function is kept but is NOT called in handleSend.
  // This ensures NO automatic scrolling happens after messages are exchanged
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); 
  };

  const handleSend = async () => {
    const userMessageContent = input.trim();
    if (!userMessageContent || loading) return;

    // 1. Set initial state (user message and loading indicator)
    const userMessage = { role: "user", content: userMessageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call API
      const res = await axios.post(
        "http://localhost:5000/api/chat", 
        { message: userMessageContent }
      );

      // 3. Add AI response
      setMessages((prevMessages) => {
        const finalMessages = [
          ...prevMessages, 
          { role: "assistant", content: res.data.reply }
        ];
        // SCROLL COMMAND OMITTED HERE
        return finalMessages;
      });
    } catch (err) {
      console.error(err);
      // Add error message
      setMessages((prevMessages) => {
        const errorMessages = [
          ...prevMessages, 
          { role: "assistant", content: "⚠️ Oops, something went wrong. Try again!" }
        ];
        // SCROLL COMMAND OMITTED HERE
        return errorMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 max-w-lg mx-auto shadow-2xl rounded-lg">
      
      {/* Header */}
      <div className="bg-[#ed6126] text-white py-4 px-6 font-extrabold text-xl shadow-md rounded-t-lg flex items-center justify-center">
        <FaRobot className="mr-3 text-2xl"/> 
        Fitby AI Assistant
      </div>

      {/* Chat Window: Handles its own scrollbar. */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-white relative">
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
        
        {/* Empty div for scroll target (now passive) */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box (Footer) */}
      <div className="p-4 border-t border-gray-200 bg-white flex items-center rounded-b-lg">
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