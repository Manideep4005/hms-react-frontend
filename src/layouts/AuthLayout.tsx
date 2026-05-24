import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

function AuthLayout({ children }: Props) {

  /**
   * Layout Component
   *
   * Used to wrap authentication pages.
   * Provides:
   * - Header bar
   * - Background
   * - Centered content
   */

  return (

    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-blue-200">

      {/* Header */}
      <header className="bg-white shadow-md">

        <div className="max-w-7xl ml-5 py-2 flex justify-between items-center">

            <img className="w-[15%]" src="/MANI_HOSPITAL.png" alt="" />
{/* 
          <nav className="space-x-6 text-sm font-medium">

            <a href="/" className="text-gray-700 hover:text-blue-600">
              Login
            </a>

            <a href="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </a>

          </nav> */}

        </div>

      </header>

      {/* Page Content */}
      <main className="flex flex-1 items-center justify-center">

        {children}

      </main>

    </div>
  )
}

export default AuthLayout