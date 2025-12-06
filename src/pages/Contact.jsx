import React from 'react'
import ContactForm from '../components/ContactForm'
import LocationContact from '../components/LocationContact'
import SubscribeSection from '../components/SubscribeSection'


const Contact = () => {
  return (
    <div>
        <ContactForm />
        <LocationContact/>
        <SubscribeSection />
    </div>
  )
}

export default Contact