"use client";

interface QuizBuilderLayoutProps {
  children: React.ReactNode;
}

export default function QuizBuilderLayout({ children }: QuizBuilderLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Optional header can go here */}
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 z-10">
        <h1 className="text-xl font-semibold">Quiz Builder</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  );
}
