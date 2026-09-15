import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans antialiased">

            {/* ============ SUBTLE BACKGROUND ============ */}

            {/* Single soft radial glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[120px]" />
                <div className="absolute bottom-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/[0.06] blur-[120px]" />
            </div>

            {/* Faint dot grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 40%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black 40%, transparent 100%)",
                }}
            />

            {/* Top border glow */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* ============ CARD ============ */}
            <div className="relative z-10 w-full max-w-md mx-4">

                {/* Card container */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f0f]/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_20px_60px_-15px_rgba(0,0,0,0.8)]">

                    {/* Top subtle gradient line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="px-8 py-12 sm:px-10 sm:py-14">

                        {/* Icon container */}
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]">
                            <ShieldAlert className="h-6 w-6 text-neutral-300" strokeWidth={1.75} />
                        </div>

                        {/* Badge */}
                        <div className="mt-6 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium tracking-wide text-neutral-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
                                Error 403
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                            Access denied
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-3 max-w-xs text-center text-[14px] leading-6 text-neutral-400">
                            You don't have permission to view this page. If you believe this is a mistake, contact your workspace administrator.
                        </p>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                            <button
                                onClick={() => navigate(-1)}
                                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-neutral-200 transition-colors duration-150 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white"
                            >
                                <ArrowLeft
                                    size={15}
                                    className="text-neutral-400 transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:text-neutral-200"
                                />
                                Go back
                            </button>


                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.01] px-6 py-3.5">
                        <span className="text-[11px] font-medium tracking-wide text-neutral-500">
                            Status · 403 Forbidden
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
                            <span className="text-[11px] font-medium tracking-wide text-neutral-500">
                                Secure
                            </span>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}