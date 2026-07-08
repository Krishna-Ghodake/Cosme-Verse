// stars.js - Detailed Stellar Taxonomy Database

export const stars = [
  {
    id: 'protostar',
    name: 'Nebula Protostar',
    classification: 'Star Formation Stage',
    color: '#ff7043',
    glowColor: 'rgba(255, 112, 67, 0.4)',
    temperature: '2,000 K - 3,000 K',
    mass: '0.1 - 20.0 M_☉',
    luminosity: '0.1 - 1,000 L_☉',
    desc: 'The early phase of star formation. A dense clump inside a collapsing giant molecular gas cloud contracts under gravity, pulling dust and gas inwards. Pressure builds until core temperatures trigger core nuclear fusion.',
    fusionShells: [
      { element: 'Molecular Hydrogen Cloud' }
    ],
    evolution: 'Contracts over 100,000 years to reach the T Tauri phase, then enters the stable Main Sequence.',
    science: 'Gravity contracts the gas cloud, converting gravitational potential energy into thermal energy. Once the core hits roughly 10 million Kelvin, hydrogen fusion begins.'
  },
  {
    id: 'main-sequence',
    name: 'Main Sequence (Sun-like)',
    classification: 'Hydrogen Fusing Stage (G-Type)',
    color: '#ffe082',
    glowColor: 'rgba(255, 224, 130, 0.4)',
    temperature: '5,778 K',
    mass: '1.0 M_☉',
    luminosity: '1.0 L_☉',
    desc: 'The longest and most stable phase of a star\'s life. The star remains in hydrostatic equilibrium, where the inward pull of gravity is precisely balanced by the outward thermal pressure of nuclear fusion in the core.',
    fusionShells: [
      { element: 'Hydrogen Core (Fusing to Helium)' },
      { element: 'Outer Hydrogen Envelope' }
    ],
    evolution: 'Spends ~10 billion years fusing hydrogen. Expands into a Red Giant once hydrogen fuel is depleted.',
    science: 'Hydrostatic equilibrium balances inward gravity with outward thermal pressure. Fuses 600 million tons of hydrogen into helium every second via the proton-proton chain.'
  },
  {
    id: 'red-giant',
    name: 'Red Giant',
    classification: 'Post-Main Sequence Shell Fusing',
    color: '#ff5722',
    glowColor: 'rgba(255, 87, 34, 0.4)',
    temperature: '3,000 K - 4,500 K',
    mass: '0.5 - 5.0 M_☉',
    luminosity: '100 - 10,000 L_☉',
    desc: 'Formed when a main-sequence star runs out of hydrogen in its core. The core contracts and heats up, while the outer layers expand and cool down, turning the star red and vastly increasing its size.',
    fusionShells: [
      { element: 'Helium Core (Fusing to Carbon)' },
      { element: 'Hydrogen Fusing Shell' },
      { element: 'Expanded Hydrogen Envelope' }
    ],
    evolution: 'Fuses helium into carbon. Discharges outer layers as a Planetary Nebula, leaving behind a White Dwarf.',
    science: 'The core contracts without hydrogen fusion, heating up until it ignites helium (triple-alpha process), while shell hydrogen fusion expands outer layers.'
  },
  {
    id: 'white-dwarf',
    name: 'White Dwarf',
    classification: 'Electron-Degenerate Remnant',
    color: '#dbfcff',
    glowColor: 'rgba(125, 244, 255, 0.4)',
    temperature: '8,000 K - 25,000 K',
    mass: '0.6 - 1.2 M_☉',
    luminosity: '0.0001 - 0.01 L_☉',
    desc: 'The remaining hot, dense core of a low-mass star after its outer layers are ejected. It has no nuclear fuel left and is held stable against gravitational collapse by electron degeneracy pressure.',
    fusionShells: [
      { element: 'Carbon-Oxygen Degenerate Core' },
      { element: 'Trace Helium Atmosphere' }
    ],
    evolution: 'No active fusion. Slowly cools down over trillions of years to eventually become a cold Black Dwarf.',
    science: 'Prevented from collapsing by quantum electron degeneracy pressure. A spoonful of its material would weigh as much as an elephant on Earth.'
  },
  {
    id: 'neutron-star',
    name: 'Neutron Star',
    classification: 'Neutron-Degenerate Core Remnant',
    color: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.4)',
    temperature: '1,000,000 K',
    mass: '1.4 - 2.1 M_☉',
    luminosity: '0.0001 L_☉',
    desc: 'The collapsed core of a massive star left behind after a supernova explosion. It is composed almost entirely of neutrons and is held stable by neutron degeneracy pressure. An incredibly dense object, only 20km in diameter.',
    fusionShells: [
      { element: 'Degenerate Neutron Core' },
      { element: 'Superfluid Outer Core' },
      { element: 'Crystalline Iron Crust' }
    ],
    evolution: 'Slows down and cools over billions of years. Can merge with other neutron stars in a kilonova.',
    science: 'Supernova collapse crushes electrons and protons into neutrons. Stable due to neutron degeneracy pressure. Density is equivalent to crushing all humanity into a sugar cube.'
  },
  {
    id: 'pulsar',
    name: 'Pulsar',
    classification: 'Rotating Magnetized Neutron Star',
    color: '#80deea',
    glowColor: 'rgba(128, 222, 234, 0.4)',
    temperature: '800,000 K',
    mass: '1.4 - 2.0 M_☉',
    luminosity: '0.001 L_☉',
    desc: 'A highly magnetized, rapidly rotating neutron star that emits beams of electromagnetic radiation out of its magnetic poles. As it spins, these beams sweep across space, appearing as pulses of light on Earth.',
    fusionShells: [
      { element: 'Degenerate Neutron Core' },
      { element: 'Superfluid Outer Core' },
      { element: 'Crystalline Iron Crust' }
    ],
    evolution: 'Rotational kinetic energy is converted into radiation, causing the spin speed to gradually slow down.',
    science: 'Conservation of angular momentum causes the core to spin ultra-fast (up to 700 times per second) as it contracts during a supernova, driving massive polar particle acceleration.'
  },
  {
    id: 'magnetar',
    name: 'Magnetar',
    classification: 'Ultra-Magnetized Neutron Star',
    color: '#26a69a',
    glowColor: 'rgba(38, 166, 154, 0.4)',
    temperature: '900,000 K',
    mass: '1.4 - 2.2 M_☉',
    luminosity: '0.002 L_☉',
    desc: 'A type of neutron star with an extremely powerful magnetic field—a thousand times stronger than a typical neutron star and a trillion times stronger than Earth\'s. High-energy magnetic decay triggers violent gamma-ray outbursts.',
    fusionShells: [
      { element: 'Degenerate Neutron Core' },
      { element: 'Superfluid Outer Core' },
      { element: 'Crystalline Iron Crust' }
    ],
    evolution: 'Powerful magnetic fields decay rapidly, depleting within ~10,000 years, leaving a normal inactive neutron star.',
    science: 'Convective dynamo action during core collapse multiplies magnetic field lines, creating fields strong enough to dissolve atomic structures at close ranges.'
  },
  {
    id: 'hypergiant',
    name: 'Stellar Hypergiant',
    classification: 'Highly Luminous Red/Yellow Supergiant',
    color: '#ff7043',
    glowColor: 'rgba(255, 112, 67, 0.4)',
    temperature: '3,500 K - 8,000 K',
    mass: '20.0 - 150.0 M_☉',
    luminosity: '100,000 - 1,000,000 L_☉',
    desc: 'The most massive, luminous, and short-lived stars in the universe. Hypergiants suffer massive mass loss due to intense stellar winds driven by their extreme luminosity, pushing the star near its Eddington stability limit.',
    fusionShells: [
      { element: 'Iron Core (End of Fusion Line)' },
      { element: 'Silicon/Sulfur Fusing Shell' },
      { element: 'Oxygen/Neon Fusing Shell' },
      { element: 'Carbon Fusing Shell' },
      { element: 'Helium Fusing Shell' },
      { element: 'Hydrogen Fusing Shell' }
    ],
    evolution: 'Core collapses catastrophically within millions of years, triggering a hypernova that leaves behind a stellar-mass Black Hole.',
    science: 'Intense core heat drives massive photon pressure that fights gravity. Fuses heavy elements in concentric onion-like layers until an inert iron core triggers collapse.'
  }
];
