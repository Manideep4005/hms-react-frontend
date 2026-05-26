import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Forbidden() {
    const navigate = useNavigate()
    const [glitch, setGlitch] = useState(false)
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setGlitch(true)

            setTimeout(() => {
                setGlitch(false)
            }, 200)
        }, 1500)

        const flashInterval = setInterval(() => {
            setFlash((prev) => !prev)
        }, 250)

        return () => {
            clearInterval(glitchInterval)
            clearInterval(flashInterval)
        }
    }, [])

    return (
        <div
            className={`
        relative overflow-hidden h-screen flex items-center justify-center
        transition-all duration-100
        ${flash ? "bg-white" : "bg-black"}
        ${glitch ? "animate-[shake_0.15s_infinite]" : ""}
      `}
        >

            {/* Flash overlay */}
            <div
                className={`
          absolute inset-0 pointer-events-none opacity-20
          ${flash ? "bg-red-500" : "bg-white"}
          animate-pulse
        `}
            />

            {/* Static Noise */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover" />

            {/* Random Flicker Bars */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500 animate-pulse opacity-60" />
            <div className="absolute bottom-20 left-0 w-full h-1 bg-white animate-ping opacity-40" />

            {/* Main Card */}
            <div
                className={`
          relative z-10 p-12 rounded-3xl border
          transition-all duration-75
          ${flash
                        ? "bg-black text-white border-red-600"
                        : "bg-white text-black border-black"
                    }
          ${glitch ? "scale-[1.02] rotate-1" : ""}
          shadow-[0_0_50px_rgba(255,0,0,0.7)]
        `}
            >

                {/* Glitch 403 */}
                <div className="relative">

                    <h1
                        className={`
              text-[130px] font-black tracking-[10px]
              ${glitch ? "translate-x-2 -translate-y-1 text-red-600" : ""}
            `}
                    >
                        403
                    </h1>

                    {/* Duplicate glitch layers */}
                    <h1 className="absolute top-0 left-0 text-[130px] font-black text-cyan-500 opacity-40 -translate-x-2">
                        403
                    </h1>

                    <h1 className="absolute top-0 left-0 text-[130px] font-black text-red-500 opacity-30 translate-x-2">
                        403
                    </h1>

                </div>

                <h2
                    className={`
            text-3xl font-extrabold tracking-[8px] uppercase mt-2
            ${glitch ? "animate-pulse" : ""}
          `}
                >
                    ACCESS FORBIDDEN
                </h2>

                <p className="mt-6 text-lg opacity-80 leading-relaxed">
                    WARNING :
                    <br />
                    Unauthorized entity detected.
                    <br />
                    Leave immediately.
                </p>

                {/* Creepy blinking text */}
                <p className="mt-6 text-red-500 text-sm tracking-[5px] animate-pulse">
                    SYSTEM BREACH DETECTED
                </p>

                {/* Button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`
            mt-8 px-8 py-3 rounded-xl font-bold tracking-widest
            transition-all duration-150
            ${flash
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-black text-white hover:bg-gray-900"
                        }
            ${glitch ? "translate-x-1" : ""}
          `}
                >
                    ESCAPE
                </button>
            </div>

            {/* Custom Animations */}
            <style>
                {`
          @keyframes shake {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            20% { transform: translate(-4px, 2px) rotate(-1deg); }
            40% { transform: translate(4px, -2px) rotate(1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            80% { transform: translate(3px, -1px) rotate(1deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
          }
        `}
            </style>

        </div>
    )
}

export default Forbidden