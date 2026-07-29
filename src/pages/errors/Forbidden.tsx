import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712]">

            {/* Aurora Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

                <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[150px]" />

                <div className="absolute left-0 top-1/2 h-[350px] w-[350px] rounded-full bg-violet-500/15 blur-[130px]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.75))]" />
            </div>

            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:70px_70px]" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-2xl">

                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 shadow-xl">

                    <ShieldAlert className="h-10 w-10 text-white" />

                </div>

                {/* Badge */}
                <div className="mt-8 flex justify-center">

                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                        HTTP 403
                    </span>

                </div>

                {/* Heading */}
                <h1 className="mt-8 text-center text-5xl font-bold tracking-tight text-white">
                    Access Denied
                </h1>

                <p className="mx-auto mt-5 max-w-md text-center text-lg leading-8 text-slate-400">
                    You don't have permission to access this page.
                    If you believe this is a mistake, please contact your administrator.
                </p>

                {/* Divider */}
                <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row">

                    <button
                        onClick={() => navigate(-1)}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15"
                    >
                        <ArrowLeft
                            size={18}
                            className="transition-transform group-hover:-translate-x-1"
                        />
                        Go Back
                    </button>


                </div>

                {/* Footer */}
                <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
                    Error Code: <span className="font-semibold text-slate-300">403 Forbidden</span>
                </div>

            </div>

            {/* Floating Blurs */}
            <div className="absolute left-16 top-16 h-3 w-3 animate-pulse rounded-full bg-cyan-400" />

            <div className="absolute bottom-20 right-20 h-4 w-4 animate-bounce rounded-full bg-violet-400" />

            <div className="absolute top-1/3 right-1/4 h-2 w-2 animate-ping rounded-full bg-blue-400" />

        </div>
    );
}