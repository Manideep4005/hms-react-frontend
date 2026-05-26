import { useNavigate } from "react-router-dom"
import { AlertTriangle, Skull, ArrowLeft } from "lucide-react"

function Forbidden() {
    const navigate = useNavigate()

    return (
        <div className="relative h-screen overflow-hidden bg-black flex items-center justify-center">

            {/* Background Glow */}
            <div className="absolute w-[500px] h-[500px] bg-red-600/20 blur-3xl rounded-full animate-pulse"></div>

            {/* Animated Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Floating Warning Icons */}
            <AlertTriangle className="absolute top-20 left-20 text-red-500 w-14 h-14 animate-bounce opacity-30" />
            <Skull className="absolute bottom-20 right-20 text-red-700 w-20 h-20 animate-pulse opacity-20" />

            {/* Main Card */}
            <div className="relative z-10 w-[90%] max-w-xl border border-red-500/30 bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(255,0,0,0.4)] p-10 text-center">

                {/* Big 403 */}
                <h1 className="text-[120px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-900 drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] leading-none animate-pulse">
                    403
                </h1>

                {/* Access Denied */}
                <h2 className="mt-4 text-3xl font-bold text-white tracking-widest uppercase">
                    ACCESS DENIED
                </h2>

                {/* Message */}
                <p className="mt-5 text-gray-400 text-lg leading-relaxed">
                    You tried to enter a restricted zone.
                    <br />
                    This incident has been logged.
                </p>

                {/* Red Divider */}
                <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>

                {/* Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 text-white font-semibold shadow-[0_0_20px_rgba(255,0,0,0.6)] hover:scale-105"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Escape
                </button>

                {/* Tiny Warning */}
                <p className="mt-6 text-xs text-red-500/60 tracking-[4px] uppercase">
                    Unauthorized Access Forbidden
                </p>

            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>

        </div>
    )
}

export default Forbidden