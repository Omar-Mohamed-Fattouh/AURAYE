import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6">404</h1>
        <p className="text-lg md:text-xl mb-6 text-white/70">
          Oops! The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-sky-400 text-black font-semibold rounded-lg hover:bg-sky-500 transition"
        >
          Go Back Home
        </Link>

        <div className="mt-8 text-white/50 text-sm">
          If you think this is a mistake, please check the URL or return to the homepage.
        </div>
      </motion.div>
    </div>
  );
}
