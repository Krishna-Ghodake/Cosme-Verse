// assistantPrompts.js - Predefined questions, smart responses, and quiz modules for the Cosmos AI assistant

export const suggestedPrompts = [
  { text: 'Compare Earth and Venus', query: 'compare earth venus' },
  { text: 'Cosmology Learning Path', query: 'recommend learning path' },
  { text: 'Explain General Relativity', query: 'explain relativity' },
  { text: 'Interactive Learning Session', query: 'start interactive session' }
];

export const knowledgeBase = [
  {
    keywords: ['earth', 'venus', 'compare'],
    response: `### Telemetry Analysis: Earth vs. Venus\n\nAlthough Earth and Venus share similar dimensions and density values, their atmospheric conditions represent divergent planetary evolution paths:\n\n*   **Earth:** Possesses a protective nitrogen-oxygen shield, liquid water oceans, and active plate tectonics that regulate climate. Surface temp averages +15°C.\n*   **Venus:** Suffers a runaway greenhouse cycle. The atmosphere is 96% carbon dioxide, trapping solar heat to maintain a crushing 462°C surface temperature (melting point of lead).\n\n**Telemetry Comparison Table:**\n\n| Parameter | Earth | Venus |\n| :--- | :--- | :--- |\n| Diameter | 12,756 km | 12,104 km |\n| Gravity | 9.8 m/s² | 8.9 m/s² |\n| Pressure | 1.0 atm | 92.0 atm |\n| Moons | 1 | 0 |`
  },
  {
    keywords: ['dark', 'matter'],
    response: `### Cosmic Telemetry: Dark Matter\n\nDark matter is a hypothetical form of matter that does not interact with light or electromagnetic fields, making it completely invisible to direct sensors. \n\n*   **Detection:** It is inferred to exist solely through its gravitational effects on visible stars, galaxies, and light (gravitational lensing).\n*   **Cosmic Ratio:** Approximately **27% of the universe** is composed of Dark Matter, compared to just 5% normal baryonic matter (stars, gas, and planets). The remaining 68% is Dark Energy.\n*   **Current Research:** Particle physicists hypothesize it consists of Weakly Interacting Massive Particles (WIMPs) or Axions, currently sought in deep underground detection chambers.`
  },
  {
    keywords: ['voyager', '1'],
    response: `### Deep Space Network: Voyager 1 Telemetry\n\n*   **Launch Date:** September 5, 1977\n*   **Current Location:** Heliopause Boundary (Interstellar Space)\n*   **Distance:** ~163.5 AU (24.4 Billion Kilometers) from Earth\n*   **Signal Time:** 22.5 Hours (one-way speed of light delay)\n*   **Status Update:** Voyager 1 is communicating via the Deep Space Network. Engineers recently corrected a telemetry telemetry glitch in the Attitude Control Loop by relocating sensor loops to backup memory sectors. Power reserves are estimated to decline below operational thresholds by 2026.`
  },
  {
    keywords: ['jwst', 'webb', 'telescope', 'discoveries'],
    response: `### James Webb Space Telescope (JWST) Deep Space Report\n\n*   **Redshift Anomaly:** JWST has captured massive, fully-formed spiral galaxies at redshift $z > 9.0$ (just 500 million years after the Big Bang). These observations challenge prevailing galaxy formation models.\n*   **Spectroscopy Scan:** Detected atmospheric water vapor, carbon dioxide, and methane on Exoplanet WASP-96b, indicating potential chemical ingredients of life.\n*   **Orbital Station:** Positioned at Earth-Sun Lagrange Point 2 (L2), 1.5 million km from Earth, keeping its primary golden mirror cooled to -233°C to maintain infrared sensitivity.`
  },
  {
    keywords: ['learning', 'path', 'curriculum', 'study'],
    response: `### 🎓 Deep Space Cosmology Learning Path\n\nI have compiled a 3-tier syllabus to guide your exploration of astrophysics:\n\n1.  **Tier 1: Planetary Dynamics & Keplerian Orbits**\n    *   *Topic:* Study gravity constants and angular momentum.\n    *   *System Tool:* Try the **Solar System Explorer** tab, and tilt orbital planes to inspect velocities.\n2.  **Tier 2: Thermonuclear Fusion & Stellar Lifecycle**\n    *   *Topic:* Carbon-oxygen core degenerate pressure, White Dwarfs, and Magnetar dipolar fields.\n    *   *System Tool:* Navigate to **Stellar Archives** and toggle the "Fusion Core" cutaways.\n3.  **Tier 3: Relativistic Singularities & Quantum Gravity**\n    *   *Topic:* Accretion disk gravitational lensing, Hawking Radiation, and Einstein rings.\n    *   *System Tool:* Use the **Black Hole Sandbox** to launch plasma probes and trigger the Singularity Plunge.`
  },
  {
    keywords: ['relativity', 'einstein', 'gravity', 'concept'],
    response: `### 🌌 Relativity & Gravitational Lensing\n\nAlbert Einstein\'s **General Theory of Relativity (1915)** describes gravity not as a physical pulling force, but as a geometric warp in the fabric of spacetime caused by mass and energy:\n\n*   **Light Bending:** Because massive objects (like black holes or galaxies) curve spacetime around them, light traveling past them must follow this curved path. This bends the light beam.\n*   **Einstein Rings:** If a massive galaxy sits directly between Earth and a distant star, the bent light forms a circular halo around the lens. This is known as an Einstein Ring.\n*   **Time Dilation:** Clocks run slower in strong gravitational fields compared to weaker fields. Near a black hole horizon, time slows down asymptotically relative to a distant observer.`
  },
  {
    keywords: ['interactive', 'session', 'tutorial', 'start'],
    response: `### 🖥️ Starting Interactive Learning Session\n\nWelcome to Command Mode! Follow these active steps to test core cosmological interfaces:\n\n*   **Step 1:** Go to the **Solar System Explorer** tab, click **Compare Decks**, load Earth and Mars, and toggle both to the **Moon Orbits** view. Inspect Phobos orbiting Mars.\n*   **Step 2:** Open the **Stellar Archives**, select **Stellar Pulsar**, and toggle between **Surface** (showing spinning jets) and **Fusion Core** (showing its degenerate neutron core).\n*   **Step 3:** Go to the **Mission Control Dashboard**, look at the **Space Weather Monitor**, and tap **INITIATE RADAR SWEEP** in the sidebar. Confirm if any NEOs are detected.`
  },
  {
    keywords: ['summary', 'summarize', 'overview'],
    response: `### 📝 System Summary: Cosmoverse Modules\n\nHere is a quick summary of the live modules accessible in your viewport:\n\n*   **Solar System Explorer:** 3D Keplerian orbital vectors, stratigraphic geological core wedges, and 3D moon simulators.\n*   **Missions Command:** Real-time heavy-lift rocket launch engines and lander module descent physics games.\n*   **Stellar Archives:** 3D energetic star convection spots, polar jets, magnetic loops, and concentric fusion shells.\n*   **Black Hole Lab:** Gravitational lensing, Hawking Radiation poles, and event horizon plunges.`
  }
];

export const quizQuestions = [
  {
    question: "Which celestial body in our solar system has the highest active volcanic density?",
    options: ["Mars", "Io (Moon of Jupiter)", "Venus", "Earth"],
    answer: 1,
    explanation: "Io, a moon of Jupiter, is the most volcanically active body in the Solar System, due to tidal heating caused by gravitational friction from Jupiter and neighboring moons."
  },
  {
    question: "What is the approximate age of the observable universe?",
    options: ["4.5 Billion Years", "10 Billion Years", "13.8 Billion Years", "20 Billion Years"],
    answer: 2,
    explanation: "Based on cosmological inflation models and cosmic microwave background readings, the universe is estimated to be 13.8 billion years old."
  },
  {
    question: "What prevents a white dwarf star from collapsing under its own gravity?",
    options: ["Nuclear fusion pressure", "Electron degeneracy pressure", "Centrifugal force", "Dark energy repulsion"],
    answer: 1,
    explanation: "Electron degeneracy pressure, a quantum mechanical effect arising from the Pauli Exclusion Principle, prevents electrons from occupying the same state, halting gravitational collapse."
  },
  {
    question: "Which exoplanet detection method measures the slight dimming of a star's light as a planet passes in front of it?",
    options: ["Radial Velocity", "Gravitational Microlensing", "Transit Method", "Direct Imaging"],
    answer: 2,
    explanation: "The Transit Method observes stars for periodic dips in brightness, indicating an orbiting planet is crossing the line of sight between the telescope and the star."
  },
  {
    question: "What is the radius around a black hole where the escape velocity equals the speed of light?",
    options: ["Singularity Limit", "Chandrasekhar Limit", "Schwarzschild Radius (Event Horizon)", "Accretion Boundary"],
    answer: 2,
    explanation: "The Schwarzschild Radius defines the boundary of the Event Horizon. Once matter crosses this radius, not even light can escape its gravitational field."
  }
];
