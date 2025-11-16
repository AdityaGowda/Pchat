export default function AuthScreenLeftPannel({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 relative">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-center p-14 w-1/3 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl">
        {/* MAIN TITLE */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
            PChat
          </h1>
          <p className="text-lg mt-3 opacity-90 leading-relaxed">
            A global public chat platform where you can message anyone who is
            currently online. Start real-time private conversations that exist
            only while both users stay connected.
          </p>
        </div>

        {/* FEATURE LIST */}
        <div className="space-y-6 text-white/90">
          <div className="flex items-center gap-4">
            <div
              className="bg-white/20 backdrop-blur-lg h-12 w-12 rounded-xl 
            flex items-center justify-center text-2xl"
            >
              🌍
            </div>
            <p className="text-lg">
              Chat with anyone worldwide who is online — no requests, no
              waiting.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="bg-white/20 backdrop-blur-lg h-12 w-12 rounded-xl 
            flex items-center justify-center text-2xl"
            >
              💬
            </div>
            <p className="text-lg">
              Real-time private messaging with instant updates.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="bg-white/20 backdrop-blur-lg h-12 w-12 rounded-xl 
            flex items-center justify-center text-2xl"
            >
              🟢
            </div>
            <p className="text-lg">
              Only users who are currently online appear in the public list.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="bg-white/20 backdrop-blur-lg h-12 w-12 rounded-xl 
            flex items-center justify-center text-2xl"
            >
              🔐
            </div>
            <p className="text-lg">
              Chats are automatically deleted when either user goes offline.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="bg-white/20 backdrop-blur-lg h-12 w-12 rounded-xl 
            flex items-center justify-center text-2xl"
            >
              ⚡
            </div>
            <p className="text-lg">
              Built for fast, smooth, and secure communication.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
