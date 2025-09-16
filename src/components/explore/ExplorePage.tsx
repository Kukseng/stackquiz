"use client"
import React from 'react'
import HeroBannerExplore from './hero-section'
import QuizChallenge from './templates-section'
import QuizInstructions from './Usage'
import ReadyTemplates from './Ready_use'
import CreateDiscoverQuiz from './create-section'

export default function ExplorePage() {
  return (
    <div className='w-full p-0'>
      <HeroBannerExplore/>
      <QuizInstructions/>
      <QuizChallenge/>
      <ReadyTemplates/>
      <CreateDiscoverQuiz/>
    </div>
  )
}
