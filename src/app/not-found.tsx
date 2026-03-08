export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-midnight text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <a href="/" className="text-tech-neon hover:text-tech-cyan transition-colors">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
