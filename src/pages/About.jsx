import React from 'react'
import AboutHero from '../components/AboutHero'
import SubscribeSection from '../components/SubscribeSection'
import AchievementsSection from '../components/AchievementsSection'

export default function About() {
  return (
    <div>
        <AboutHero/>
        <AchievementsSection/>
        <SubscribeSection />
    </div>
  )
}
