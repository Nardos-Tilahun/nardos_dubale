"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import NextImage from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Send, 
  MessageSquare, 
  X, 
  Code, 
  Link as LinkIcon, 
  Trash2, 
  AlertCircle, 
  Bot, 
  ArrowUp,
  Layers,
  Terminal,
  UserCircle,
  Zap,
  Sparkles // Added missing import
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
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

// --- Premium Animation Variants ---
const windowVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20, 
    transformOrigin: "bottom right",
    filter: "blur(8px)"
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { 
      type: "spring", 
      stiffness: 350, 
      damping: 25, 
      mass: 0.8
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    filter: "blur(8px)",
    transition: { duration: 0.15 } 
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
  <div className="my-3 rounded-lg overflow-hidden border border-white/10 bg-[#09090b] shadow-sm">
    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
      <span className="text-[10px] font-mono text-zinc-500 lowercase">{language || 'code'}</span>
    </div>
    <SyntaxHighlighter
      language={language || "javascript"}
      style={vscDarkPlus}
      customStyle={{ margin: 0, padding: "12px", fontSize: "11px", lineHeight: "1.5", background: "transparent" }}
      wrapLongLines={true}
    >
      {value}
    </SyntaxHighlighter>
  </div>
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`
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

  // --- High-Value Suggestion Cards ---
  const suggestionCards = [
    { 
      icon: <Layers className="w-4 h-4 text-blue-400" />, 
      label: "System Architecture", 
      question: "Break down the architecture of the Goal Cracker project." 
    },
    { 
      icon: <Terminal className="w-4 h-4 text-purple-400" />, 
      label: "Technical Stack", 
      question: "What is Nardos's preferred tech stack and why?" 
    },
    { 
      icon: <UserCircle className="w-4 h-4 text-emerald-400" />, 
      label: "About Nardos", 
      question: "Tell me about Nardos's background as a Full Stack Developer." 
    },
    { 
      icon: <Zap className="w-4 h-4 text-amber-400" />, 
      label: "Flagship Features", 
      question: "What makes the Goal Cracker AI different from other chatbots?" 
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
            className="pointer-events-auto w-[90vw] sm:w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-[#09090b] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md shrink-0 z-30">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 border border-white/10">
                  <Bot className="w-4 h-4 text-emerald-500" />
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full border-2 border-[#09090b]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-200">Interactive Agent</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Powered by Groq Llama 3</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                         <button onClick={() => setShowDelete(true)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-md">
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content className="bg-zinc-900 text-zinc-200 text-[10px] px-2 py-1 rounded border border-white/10 z-[60]" sideOffset={5}>Clear Chat</Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                )}
                <button onClick={toggleChat} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
              {messages.length === 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="h-full flex flex-col items-center justify-center"
                >
                  <motion.div variants={itemVariants} className="relative mb-6 group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-1000" />
                    <Sparkles className="w-12 h-12 text-zinc-500/50 relative z-10" />
                  </motion.div>
                  
                  <motion.h2 variants={itemVariants} className="text-lg font-semibold text-white mb-2 tracking-tight">
                    {greeting}, I am Nardos's AI Architect.
                  </motion.h2>
                  
                  <motion.p variants={itemVariants} className="text-xs text-zinc-400 text-center max-w-[280px] leading-relaxed mb-8">
                    I have deep access to this portfolio's codebase and Nardos's engineering background. I can dissect projects, explain technical decisions, or summarize skills.
                  </motion.p>

                  <motion.div variants={containerVariants} className="grid grid-cols-1 gap-2 w-full max-w-[320px]">
                    {suggestionCards.map((card, i) => (
                      <motion.button
                        key={i}
                        variants={itemVariants}
                        onClick={() => handleSubmit(card.question)}
                        className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all text-left active:scale-[0.98]"
                      >
                        <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 group-hover:border-white/10 transition-colors shadow-sm">
                          {card.icon}
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                             {card.label}
                           </span>
                           <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500 transition-colors">
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
                      className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center border shadow-sm mt-0.5 ${
                        m.role === 'user' ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-white/10'
                      }`}>
                        {m.role === 'user' ? <UserCircle className="w-4 h-4"/> : <Bot className="w-4 h-4"/>}
                      </div>

                      <div className={`max-w-[85%] text-sm leading-relaxed ${
                        m.role === 'user' ? 'text-zinc-200 text-right' : 'text-zinc-300'
                      }`}>
                         {m.isTyping ? (
                           <div className="flex gap-1 py-2">
                              {[0,1,2].map(i => (
                                <motion.div key={i} className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full" animate={{opacity: [0.3,1,0.3]}} transition={{duration: 0.8, repeat: Infinity, delay: i*0.2}} />
                              ))}
                           </div>
                         ) : (
                           <div className="markdown-content">
                             <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "")
                                    return match ? (
                                      <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />
                                    ) : (
                                      <code className="bg-white/10 text-zinc-200 px-1 py-0.5 rounded text-[11px] font-mono border border-white/5" {...props}>
                                        {children}
                                      </code>
                                    )
                                  },
                                  img({ src, alt }) {
                                    if (typeof src !== 'string') return null
                                    return <div className="relative w-full h-40 my-2 rounded-lg border border-white/10 overflow-hidden shadow-sm"><NextImage src={src} alt={alt||""} fill className="object-cover" /></div>
                                  },
                                  a: ({ href, children }) => <a href={href} target="_blank" className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-2 hover:decoration-emerald-400 hover:text-emerald-300 transition-colors font-medium">{children}</a>,
                                  ul: ({ children }) => <ul className="list-disc pl-4 my-2 space-y-1 marker:text-zinc-600 text-zinc-300">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-4 my-2 space-y-1 marker:text-zinc-600 text-zinc-300">{children}</ol>,
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
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
                  <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[#09090b] z-20">
               <div className="relative flex items-end gap-2 bg-[#121214] border border-white/5 rounded-xl p-1.5 focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/5 transition-all shadow-lg">
                 <textarea
                   ref={inputRef}
                   value={input}
                   onChange={handleInput}
                   onKeyDown={handleKeyDown}
                   placeholder="Ask about code, stack, or projects..."
                   className="w-full bg-transparent border-none text-sm text-zinc-200 placeholder:text-zinc-600 resize-none focus:ring-0 px-3 py-2.5 max-h-24 min-h-[44px] scrollbar-none leading-relaxed"
                   disabled={isLoading}
                   rows={1}
                 />
                 <button 
                   onClick={() => handleSubmit()}
                   disabled={!input.trim() || isLoading}
                   className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all mb-1.5 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                 >
                   {isLoading ? <div className="h-3 w-3 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <ArrowUp className="w-4 h-4 stroke-[3px]" />}
                 </button>
               </div>
               <div className="text-center mt-2 flex items-center justify-center gap-1 opacity-30">
                 <span className="text-[9px] font-medium text-zinc-400">AI-Generated responses</span>
               </div>
            </div>

            {/* Confirmation */}
            <AnimatePresence>
              {showDelete && (
                <motion.div 
                  initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-50"
                >
                  <motion.div 
                     initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}}
                     className="w-full max-w-[260px] bg-[#18181b] border border-white/10 rounded-xl p-5 text-center shadow-2xl"
                  >
                    <div className="flex justify-center mb-3">
                      <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 border border-red-500/20">
                        <Trash2 className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Clear history?</h3>
                    <p className="text-xs text-zinc-500 mb-4">This action cannot be undone.</p>
                    <div className="flex gap-2 justify-center w-full">
                      <Button variant="secondary" size="sm" onClick={() => setShowDelete(false)} className="h-8 text-xs w-full bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300">Cancel</Button>
                      <Button variant="destructive" size="sm" onClick={clearChat} className="h-8 text-xs w-full bg-red-600 hover:bg-red-500 border-none text-white">Clear</Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="pointer-events-auto h-14 w-14 bg-white text-black rounded-full shadow-[0_4px_25px_rgba(0,0,0,0.25)] flex items-center justify-center border border-white/10 hover:bg-zinc-200 transition-colors z-50 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MessageSquare className="w-6 h-6 fill-black relative z-10" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-[#09090b] flex items-center justify-center z-20">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}