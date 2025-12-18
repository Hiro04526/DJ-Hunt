"use client"

interface HeaderProps {
  user: { email: string; token: string } | null
  onLogout: () => void
}

export function HitlistHeader({ user, onLogout }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-6xl md:text-8xl font-medium uppercase mb-2">
          Hitlist <span className="text-[#569429]">Voting</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium font-secondary text-2xl">
          Curate the sound of Green Giant FM.
        </p>
      </div>

      {user && (
        <div className="flex items-center justify-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <span className="text-sm font-secondary font-bold uppercase tracking-wider opacity-70 text-center">
            Signed in as <strong>{user.email}</strong>
          </span>
          <button
            onClick={onLogout}
            className="text-sm font-secondary font-bold text-red-500 hover:underline hover:cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      )}
    </header>
  )
}