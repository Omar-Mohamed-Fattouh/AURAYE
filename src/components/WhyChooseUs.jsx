import React from 'react';

const reasonsData = [
  {
    title: ' High-Quality Eyewear',
    description: ' Our glasses are crafted with premium materials to ensure durability and comfort For example, Sarah, who struggled with daily headaches due to poor vision, found relief after choosing our AR-fit glasses. She now enjoys clear vision all day without discomfort.',
   
   bgGradient: 'bg-black/20'  ,  
 
    bgImage: 'bg-[url("HP_JUPITER_SECONDARY_BANNER_D.avif")]' 
  },
  {
    title: 'Stylish & Modern Designs',
    description: '  We provide trendy eyewear that helps customers express their personality For instance, Ahmed wanted a stylish look for his online meetings. Using our AR try-on, he found the perfect frame that matches his style, boosting his confidence at work',
    bgGradient: 'bg-black/20'  , 
    bgImage: 'bg-[url("HP_JUPITER_SECONDARY_BANNER_D.avif")]'
  },
  {
    title: ' Personalized AR Experience',
    description: '   With our AR try-on, customers can virtually try glasses before buying, ensuring a perfect fit For example, Lina was unsure about which frames suited her face. The AR tool helped her see the glasses on her face in real time, making the choice easy and risk-free',
    bgGradient: 'bg-black/20'  , 
    bgImage: 'bg-[url("HP_JUPITER_SECONDARY_BANNER_D.avif")]'
  },
];

// المكون الفرعي لبطاقة السبب
const ReasonCard = ({ title, description, bgGradient, bgImage }) => (
  <div className="flex flex-col md:flex-row items-center text-right md:space-x-4 space-y-4 md:space-y-0" dir="rtl">
    
    {/* صندوق النص والمحتوى (الجزء الأيمن في الشاشات الكبيرة) */}
    <div className="flex-1 w-full md:w-auto p-2">
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>

    {/* صندوق الصورة والعنوان (الجزء الأيسر في الشاشات الكبيرة) */}
    <div 
      className={`relative w-full md:w-1/2 h-36 rounded-lg shadow-lg overflow-hidden flex items-center p-6 bg-cover bg-center ${bgImage}`}
    >
      {/* طبقة التدرج اللوني الشفافة */}
      <div className={`absolute inset-0 opacity-80 ${bgGradient}`}></div>
      
     
    </div>
  </div>
);

// المكون الرئيسي للقسم
const WhyChooseUs = () => (
  <section className="max-w-6xl mx-auto p-4 md:p-8 pt-10 text-center" dir="rtl">
    
    {/* العناوين الرئيسية */}
    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Why Choose Us </h1>
    <p className="text-lg text-gray-500 mb-12">Enjoy a smooth shopping experience with fast shipping and helpful customer support.</p>

    {/* قائمة الأسباب */}
    <div className="space-y-10">
      {reasonsData.map((reason, index) => (
        <ReasonCard
          key={index}
          title={reason.title}
          description={reason.description}
          bgGradient={reason.bgGradient}
          bgImage={reason.bgImage}
        />
      ))}
    </div>
  </section>
);

export default WhyChooseUs;