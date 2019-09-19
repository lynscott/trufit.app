import React from 'react'
import { Provider, Heading, Subhead } from 'rebass'
import {
  Hero, CallToAction, ScrollDownIndicator
} from 'react-landing-page'

const img = require("./images/FT1-01-T.png")

const Landing = props => (
  <Provider>
    <Hero
      color="black"
      bg="white"
      backgroundImage='https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/gym.webp'
    >
        <Heading>Name of your app</Heading>
        <Subhead>a couple more words</Subhead>
        <CallToAction href="/getting-started" mt={3}>Get Started</CallToAction>
        <ScrollDownIndicator/>
    </Hero>
  </Provider>
)

export default Landing;