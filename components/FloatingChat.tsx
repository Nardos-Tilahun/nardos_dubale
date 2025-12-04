"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Send, 
  MessageSquare, 
  X, 
  Trash2, 
  AlertCircle, 
  Bot, 
  ArrowUp,
  Layers,
  Terminal,
  UserCircle,
  Zap,
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import * as Tooltip from "@radix-ui/react-tooltip"

// --- Types ---
type Message = {
  id: number
  role: "user" | "ai"
  content: string
  isTyping?: boolean
  shouldRedirectToContact?: boolean
}

// --- Animation Variants ---
const windowVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20, 
    transformOrigin: "bottom right",
    filter: "blur(4px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 350, 
      damping: 30,
      mass: 1
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    filter: "blur(4px)",
    transition: { duration: 0.2 } 
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

// --- Components ---

const CodeBlock = ({ language, value }: { language: string; value: string }) => (
  <div className="my-4 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e20] shadow-md">
    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
      <span className="text-xs font-mono text-gray-400 lowercase">{language || 'code'}</span>
    </div>
    <SyntaxHighlighter
      language={language || "javascript"}
      style={oneDark}
      customStyle={{ margin: 0, padding: "16px", fontSize: "13px", lineHeight: "1.6", background: "transparent" }}
      wrapLongLines={true}
    >
      {value}
    </SyntaxHighlighter>
  </div>
)

const ActionTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => (
  <Tooltip.Provider delayDuration={300}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-white/10 z-[60]" sideOffset={5}>
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
)

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(1)
  const [showDelete, setShowDelete] = useState(false)
  const [greeting, setGreeting] = useState("Hello")

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // --- Logic ---

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const toggleChat = () => {
    setIsOpen((p) => !p)
    if (!isOpen) setUnreadCount(0)
  }

  const clearChat = () => {
    setMessages([])
    setShowDelete(false)
    setError(null)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = async (text?: string) => {
    const content = text || input
    if (!content.trim()) return
    
    setInput("")
    if(inputRef.current) inputRef.current.style.height = "auto"

    const userMessage: Message = { id: Date.now(), role: "user", content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    const typingId = Date.now() + 1
    setMessages(prev => [...prev, { id: typingId, role: "ai", content: "", isTyping: true }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, messages }),
      })

      setMessages(prev => prev.filter(m => m.id !== typingId))

      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      
      const aiMessage: Message = {
        id: Date.now() + 2,
        role: "ai",
        content: data.message.content,
        shouldRedirectToContact: data.message.shouldRedirectToContact
      }
      setMessages(prev => [...prev, aiMessage])

      if (data.message.shouldRedirectToContact) {
        setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 1500)
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== typingId))
      setError("Network unavailable.")
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  const suggestionCards = [
    { 
      icon: <Layers className="w-4 h-4 text-blue-400" />, 
      label: "Architecture", 
      question: "Break down the architecture of the Goal Cracker project." 
    },
    { 
      icon: <Terminal className="w-4 h-4 text-purple-400" />, 
      label: "Tech Stack", 
      question: "What is Nardos's preferred tech stack?" 
    },
    { 
      icon: <UserCircle className="w-4 h-4 text-emerald-400" />, 
      label: "Experience", 
      question: "Tell me about Nardos's background." 
    },
    { 
      icon: <Zap className="w-4 h-4 text-amber-400" />, 
      label: "Highlights", 
      question: "What makes the Goal Cracker AI special?" 
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none font-sans antialiased">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat"
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // INCREASED SIZE for better readability on desktop
            className="pointer-events-auto w-[90vw] sm:w-[400px] h-[650px] max-h-[85vh] flex flex-col bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#18181b] shrink-0 z-30">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-800 border border-white/10">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-[#18181b]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Interactive Agent</span>
                  <span className="text-[11px] text-zinc-400">Please feel free to ask anything about Nardos</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <ActionTooltip content="Clear Chat">
                     <button onClick={() => setShowDelete(true)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-md">
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </ActionTooltip>
                )}
                <button onClick={toggleChat} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-all rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#18181b] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="h-full flex flex-col items-center justify-center pb-8"
                >
                  <motion.div variants={itemVariants} className="relative mb-6 group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-1000" />
                    <Sparkles className="w-14 h-14 text-zinc-400/50 relative z-10" />
                  </motion.div>
                  
                  <motion.h2 variants={itemVariants} className="text-xl font-semibold text-white mb-2">
                    {greeting}.
                  </motion.h2>
                  
                  <motion.p variants={itemVariants} className="text-sm text-zinc-400 text-center max-w-[280px] leading-relaxed mb-8">
                    I am Nardos's AI Architect. I can analyze code, explain projects, or schedule a meeting.
                  </motion.p>

                  <motion.div variants={containerVariants} className="grid grid-cols-1 gap-3 w-full max-w-[340px]">
                    {suggestionCards.map((card, i) => (
                      <motion.button
                        key={i}
                        variants={itemVariants}
                        onClick={() => handleSubmit(card.question)}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 hover:border-white/10 transition-all text-left"
                      >
                        <div className="p-2 rounded-lg bg-black/20 border border-white/5 group-hover:border-white/10 transition-colors">
                          {card.icon}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                             {card.label}
                           </span>
                           <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                             {card.question.substring(0, 40)}...
                           </span>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  {messages.map((m) => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center border shadow-sm mt-1 ${
                        m.role === 'user' ? 'bg-white text-black border-white' : 'bg-zinc-800 text-emerald-400 border-white/10'
                      }`}>
                        {m.role === 'user' ? <UserCircle className="w-5 h-5"/> : <Bot className="w-5 h-5"/>}
                      </div>

                      <div className={`max-w-[85%] text-sm leading-relaxed ${
                        m.role === 'user' ? 'text-zinc-100' : 'text-zinc-200'
                      }`}>
                         {m.isTyping ? (
                           <div className="flex gap-1.5 py-3 px-2">
                              {[0,1,2].map(i => (
                                <motion.div key={i} className="w-2 h-2 bg-emerald-500/50 rounded-full" animate={{opacity: [0.3,1,0.3]}} transition={{duration: 0.8, repeat: Infinity, delay: i*0.2}} />
                              ))}
                           </div>
                         ) : (
                           <div className={`markdown-content p-3 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600/20 border border-emerald-500/20 text-white' : 'bg-zinc-800/50 border border-white/5'}`}>
                             <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    return match ? (
                                      <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
                                    ) : (
                                      <code className="bg-black/30 text-emerald-200 px-1.5 py-0.5 rounded text-[12px] font-mono border border-white/5" {...props}>
                                        {children}
                                      </code>
                                    )
                                  },
                                  img({ src, alt }) {
                                    if (typeof src !== 'string') return null
                                    return <div className="relative w-full h-48 my-3 rounded-lg border border-white/10 overflow-hidden shadow-lg"><NextImage src={src} alt={alt||""} fill className="object-cover" /></div>
                                  },
                                  a: ({ href, children }) => <a href={href} target="_blank" className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-4 hover:decoration-emerald-400 hover:text-emerald-300 transition-colors font-semibold">{children}</a>,
                                  ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-2 marker:text-zinc-500">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-2 marker:text-zinc-500">{children}</ol>,
                                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-7 text-sm">{children}</p> // Increased line-height
                                }}
                             >
                               {m.content}
                             </ReactMarkdown>
                           </div>
                         )}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              {error && (
                <div className="flex justify-center">
                  <span className="text-xs bg-red-500/10 text-red-300 px-3 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#18181b] border-t border-white/5 z-20">
               <div className="relative flex items-end gap-2 bg-zinc-900 border border-white/10 rounded-xl p-2 focus-within:border-emerald-500/40 focus-within:ring-1 focus-within:ring-emerald-500/10 transition-all shadow-sm">
                 <textarea
                   ref={inputRef}
                   value={input}
                   onChange={handleInput}
                   onKeyDown={handleKeyDown}
                   placeholder="Ask me anything..."
                   className="w-full bg-transparent border-none text-sm text-white placeholder:text-zinc-500 resize-none focus:ring-0 px-3 py-2.5 max-h-32 min-h-[44px] scrollbar-none leading-relaxed"
                   disabled={isLoading}
                   rows={1}
                 />
                 <button 
                   onClick={() => handleSubmit()}
                   disabled={!input.trim() || isLoading}
                   className="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all mb-1 shadow-lg shadow-emerald-900/20"
                 >
                   {isLoading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <ArrowUp className="w-5 h-5 stroke-[3px]" />}
                 </button>
               </div>
               <div className="text-center mt-2.5 flex items-center justify-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity">
                 <Zap className="w-3 h-3" />
                 <span className="text-[10px] font-medium text-zinc-400">AI-Generated</span>
               </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showDelete && (
                <motion.div 
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8 z-50"
                >
                  <motion.div 
                     initial={{scale:0.95, y: 10}} animate={{scale:1, y:0}} exit={{scale:0.95, y:10}}
                     className="w-full max-w-[280px] bg-[#18181b] border border-white/10 rounded-xl p-6 text-center shadow-2xl"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                        <Trash2 className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Clear conversation?</h3>
                    <p className="text-xs text-zinc-400 mb-6 leading-relaxed">This will permanently remove all messages from this session.</p>
                    <div className="flex gap-3 justify-center w-full">
                      <Button variant="secondary" size="sm" onClick={() => setShowDelete(false)} className="h-9 text-xs w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10">Cancel</Button>
                      <Button variant="destructive" size="sm" onClick={clearChat} className="h-9 text-xs w-full bg-red-600 hover:bg-red-500 border-none text-white shadow-lg shadow-red-900/20">Confirm</Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: 20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="pointer-events-auto h-14 w-14 bg-white text-black rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-white hover:bg-zinc-200 transition-colors z-50 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MessageSquare className="w-6 h-6 fill-black relative z-10" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-[#09090b] shadow-sm z-20 animate-in zoom-in duration-300" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}