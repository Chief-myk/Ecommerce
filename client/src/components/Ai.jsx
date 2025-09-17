import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'

const Ai = () => {
    const [isListening, setIsListening] = useState(false)
    const navigate = useNavigate()
    const openingSound = new Audio("/robo.mp3")
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    function speak(message) {
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.rate = 0.9
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
    }

    const startListening = () => {
        if (!speechRecognition) {
            toast.error("Speech recognition not supported in your browser")
            return
        }

        const recognition = new speechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'

        recognition.onstart = () => {
            setIsListening(true)
            toast.info("🎤 Listening... Speak now!")
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        recognition.onerror = (e) => {
            setIsListening(false)
            if (e.error === 'not-allowed') {
                toast.error("Please allow microphone access")
            } else {
                toast.error("Speech recognition error. Try again.")
            }
        }

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.trim().toLowerCase()
            console.log('Transcript:', transcript)
            
            // Navigation commands
            const commands = {
                home: ["home", "dashboard", "main"],
                order: ["order", "orders"],
                collections: ["list", "products", "inventory" , "collection"],
                contact: ["contact" , "support", "help"],
                about: ["about", "info", "information"],
                login: ["login", "sign in"],
                cart : ["cart", "basket", "checkout"]
            }

            let foundCommand = false
            
            for (const [route, keywords] of Object.entries(commands)) {
                if (keywords.some(keyword => transcript.includes(keyword))) {
                    const routePath = route === 'home' ? '/' : `/${route}`
                    navigate(routePath)
                    speak(`Going to ${route} page`)
                    foundCommand = true
                    break
                }
            }

            if (!foundCommand) {
                toast.error("Command not recognized. Try saying 'go to home' or 'open orders'")
                speak("Sorry, I didn't understand that command")
            }
        }

        // Start recognition
        openingSound.play().catch(() => {})
        recognition.start()
    }

    return (
        <div className='fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] z-50'>
            <div 
                className={`relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${
                    isListening ? 'animate-pulse' : ''
                }`}
                onClick={startListening}
            >
                <img 
                    src="/Ai.png" 
                    alt="AI Assistant" 
                    className='w-[130px] drop-shadow-lg'
                />
                
                {/* Listening indicator */}
                {isListening && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black bg-opacity-75 text-white text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Click to speak
                </div>
            </div>
        </div>
    )
}

export default Ai