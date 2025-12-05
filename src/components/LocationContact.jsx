import React from 'react';

export default function LocationContact() {
  return (
    <div className="w-[100vw] mx-auto bg-gray-100 p-6 rounded-lg">
      <h2 className="text-3xl font-semibold mb-4">Our Location</h2>
<p className='mb-5'>Here is the location map or details...</p>
<div className="flex justify-center">
<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6866.6587582664015!2d32.276558818491495!3d30.62467352936934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1764656306190!5m2!1sen!2seg" 
width="95%" 
height="500"
 style={{ border: 0 }}
  allowfullscreen=""
   loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
            className="rounded-lg"

    ></iframe>
    </div>
      
      
    </div>
  );
}


