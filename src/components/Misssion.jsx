// import { Eye } from 'lucide-react'
// import React from 'react'

// export default function OurMisssion() {
//   return (
//     <section className="relative overflow-hidden py-20 lg:py-32">
//   <div className="absolute -top-32 -left-32 w-96 h-96 bg-gray-200/50 dark:bg-slate-700/50 rounded-full blur-3xl opacity-50" />
//   <div className="absolute -top-16 -right-48 w-[40rem] h-[40rem] bg-gray-200/50 dark:bg-slate-700/50 rounded-full blur-3xl opacity-30" />
//   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
//       <div className="relative order-2 lg:order-1">
//         <div className="relative grid grid-cols-2 gap-4">
//           <div className="col-span-1 pt-12">
//             <img
//               alt="Team members in a meeting"
//               className="rounded-lg shadow-xl w-full h-auto object-cover mb-5"
//               src="1.jpg"
//             />
//           </div>
//           <div className="col-span-1">
//             <img
//               alt="Diverse group of colleagues sitting together"
//               className="rounded-lg shadow-xl w-full h-auto object-cover"
//               src="Sunglasses.jpg"
//             />
//           </div>
//           <div className="col-span-2 sm:col-span-1 sm:col-start-2 -mt-16 sm:-mt-24">
//             <img
//               alt="Person stacking wooden blocks symbolizing strategy"
//               className="rounded-lg shadow-xl w-full h-auto object-cover"
//               src="2.jpg"
//             />
//           </div>
//         </div>
//       </div>
//       <div className="relative order-1 lg:order-2">
//         <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900  mb-6">
//           Our Mission
//         </h2>
//         <p className="text-gray-500  text-lg mb-10 leading-relaxed">
//           Our mission is to make high-quality eyewear accessible to everyone.
// We believe that clear vision should never be a luxury, so we work to offer stylish, durable, and comfortable glasses at fair prices. Every pair we create is designed to help people see better, feel confident, and express their individuality.
// Our goal is to combine modern design with reliable quality—so you can focus on what matters most, with clarity and comfort every day.
//         </p>
//         <div className="bg-black p-6 rounded-lg shadow-lg">
//           <div className="flex items-start space-x-6">
//             <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center icon-3d">
//               <span className="material-icons border rounded-lg p-4 text-white text-4xl">
//                 <Eye/>
//               </span>
//             </div>
//             <p className="text-white font-bold text-lg">
//               We strive to provide a better viewing experience through high quality and reliable service to every customer.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="absolute -bottom-48 -right-32 w-96 h-96 bg-gray-200/50  rounded-full blur-3xl opacity-50" />
//   <div className="absolute -bottom-32 -left-48 w-[40rem] h-[40rem] bg-gray-200/50  rounded-full blur-3xl opacity-30" />
// </section>

//   )
// }
import React from 'react'
import AboutHero from './AboutHero'
import AboutVision from './AboutVision'

export default function Misssion() {
  return (
    <div>
        <AboutHero/>
        <AboutVision/>
        
    </div>
  )
}
