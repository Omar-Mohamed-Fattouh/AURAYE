import { CheckCircle, Eye, RotateCw, ScanFace, Star } from 'lucide-react'
import { motion, delay } from "framer-motion";
import React from 'react'

export default function Why() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Auraye?
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Experience eyewear like never before. Our AR-powered glasses combine style, technology, and personalized experiences to make trying, choosing, and wearing glasses effortless and fun.
            </p>
          </div>
          <a
            className="mt-6 md:mt-0 flex-shrink-0 bg-black text-white py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
            href="#"
          >
            Try Now
          </a>
        </header>
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-200 text-primary p-8 flex flex-col rounded-2xl">
            <div className="mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">
                
                <motion.div
          className="w-8 h-8 rounded-full   overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eye className="text-black  w-8 h-8" />
        </motion.div>
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Virtual Try-On
            </h2>
            <p className="text-gray-600 text-sm mb-8 flex-grow">
              Instantly try any frame in AR. See how it fits your face in real time, without visiting a store.
            </p>
            <a
              className="bg-black text-white text-center py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
              href="#"
            >
              Try Now
            </a>
          </div>

          <div className="bg-gray-200 text-primary p-8 flex flex-col rounded-2xl">
            <div className="mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">
                <motion.div
          className="w-8 h-8 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Star className="text-black w-8 h-8" />
        </motion.div>
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Personalized Recommendations
            </h2>
            <p className="text-gray-600 text-sm mb-8 flex-grow">
              Get smart suggestions for frames and lenses based on your face shape, style preferences, and AR analysis.
            </p>
            <a
              className="bg-black text-white text-center py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
              href="#"
            >
              Discover
            </a>
          </div>

          <div className="bg-gray-200 text-primary p-8 flex flex-col rounded-2xl">
            <div className="mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">
                <motion.div
          className="w-8 h-8 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ScanFace className="text-black w-8 h-8" />
        </motion.div>
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              3D Frame Viewer
            </h2>
            <p className="text-gray-600 text-sm mb-8 flex-grow">
              Explore glasses in full 3D. Rotate frames, zoom in on details, and preview colors before you buy.
            </p>
            <a
              className="bg-black text-white text-center py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
              href="#"
            >
              Explore
            </a>
          </div>

          <div className="bg-gray-200 text-primary p-8 flex flex-col rounded-2xl">
            <div className="mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">
                <motion.div
          className="w-8 h-8 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle className="text-black w-8 h-8" />
        </motion.div>
              </span>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Lens & Fit Guidance
            </h2>
            <p className="text-gray-600 text-sm mb-8 flex-grow">
              Receive accurate lens recommendations and AR-based fit guidance for maximum comfort and style.
            </p>
            <a
              className="bg-black text-white text-center py-3 px-6 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300"
              href="#"
            >
              Learn More
            </a>
          </div>
        </main>
      </div>
    </div>
  )
}
