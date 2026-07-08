// planets.js - Expanded Solar System explorer planetary database

export const planets = [
  {
    id: 'mercury',
    name: 'Mercury',
    classification: 'TERRESTRIAL',
    mass: '0.330', // 10^24 kg
    diameter: '4,879 km',
    gravity: '3.7 m/s²',
    moons: 0,
    distanceFromSun: '0.39 AU',
    orbitPeriod: '88 Days',
    escapeVelocity: '4.3 km/s',
    orbitalSpeed: '47.4 km/s',
    rotationSpeed: '10.8 km/h',
    composition: '70% metallic (iron core), 30% silicate material by weight.',
    magneticField: 'Weak global magnetic field, roughly 1% of Earth\'s strength, active core dynamo.',
    geologicalInfo: 'Heavily cratered highlands, smooth volcanic plains, and prominent wrinkle ridges (rupes) caused by planet shrinkage as it cooled.',
    discoveryHistory: 'Known since at least Sumerian times (3rd millennium BC). Cataloged by Babylonian astronomers as Nabu. Observed telescopically by Galileo in 1610.',
    explorationMissions: ['Mariner 10 (1974-1975 flybys)', 'MESSENGER (2011-2015 orbital mission)', 'BepiColombo (launched 2018, LEO entry 2025)'],
    funFacts: [
      'A year on Mercury is 88 Earth days, but a single solar day (sunrise to sunrise) takes 176 Earth days!',
      'It is the second densest planet in the solar system, with a massive iron core occupying 85% of its radius.',
      'Despite being closest to the Sun, it is not the hottest planet—Venus holds that title.'
    ],
    color: '#9e9e9e',
    glowColor: 'rgba(158, 158, 158, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDodgOyO2Uw1HrEL9a9Svzf8tW846H6HfCcGcO24HxcYui4u8ZpkGgQTjyV5DMH6g7cvbdNnEb2-uwxTXOdMgyR7lv3jY__D0iLSgR4LG2N8BJA4Et4nPCGzj27I6sXS4vw7DhHiKBW3tAL0G2WQOjZAT0734aKwFZnNXv7JhxLI1MvNp_WtdnYhC9VJsKc_DxT0oTHoyGK7JGF248woP5Rt_WzXcBRjCNTINPWAX-auanVaWJFFfpX',
    desc: 'The smallest and closest planet to the Sun. Mercury experiences extreme temperature fluctuations, ranging from blazing hot days to freezing cold nights due to its lack of a thick atmosphere.',
    details: {
      atmosphere: 'Trace exosphere of helium, sodium, and oxygen ejected by solar wind.',
      surface: 'Heavily cratered, ancient lava flows, similar to Earth\'s moon.',
      tempRange: '-173°C to 427°C'
    },
    interior: [
      { name: 'Crust', thickness: '35 km', composition: 'Silicate rock' },
      { name: 'Mantle', thickness: '400 km', composition: 'Solid silicate rock' },
      { name: 'Core', thickness: '2020 km', composition: 'Molten iron-nickel alloy' }
    ],
    atmosphereLayers: [
      { name: 'Exosphere', description: 'Extremely thin collisionless boundary containing hydrogen, helium, and sodium atoms captured from solar winds.' }
    ],
    aiAnomalies: 'Detected elevated magnetic field oscillations in the northern hemisphere, indicating active core convection. Heavy iron concentration suggested remnants of a primordial planetary collision.'
  },
  {
    id: 'venus',
    name: 'Venus',
    classification: 'TERRESTRIAL',
    mass: '4.87',
    diameter: '12,104 km',
    gravity: '8.9 m/s²',
    moons: 0,
    distanceFromSun: '0.72 AU',
    orbitPeriod: '225 Days',
    escapeVelocity: '10.36 km/s',
    orbitalSpeed: '35.0 km/s',
    rotationSpeed: '-6.5 km/h (Retrograde)',
    composition: 'Basaltic rock and silicate crust, iron-nickel core.',
    magneticField: 'No internal dynamo; possesses a weak induced magnetosphere created by the solar wind interacting with its ionosphere.',
    geologicalInfo: 'Thousands of volcanoes, expansive lava plains (fluctus), unique pancake dome structures, and highly fractured tessera highlands.',
    discoveryHistory: 'Brightest object in the night sky after the Moon, tracked since prehistoric times. First planet to be scanned by a spacecraft (Mariner 2 in 1962).',
    explorationMissions: ['Venera series (USSR, 1961-1983 landers)', 'Magellan (US, 1990-1994 radar mapping)', 'Venus Express (ESA, 2006-2014)'],
    funFacts: [
      'Venus rotates on its axis backwards (retrograde), meaning the sun rises in the west and sets in the east.',
      'One day on Venus (rotation) is longer than one year (orbit around the Sun).',
      'The atmospheric pressure is 92 times that of Earth—equivalent to being 1,000 meters deep in the ocean.'
    ],
    color: '#ffb74d',
    glowColor: 'rgba(255, 183, 77, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxN2ut4x9kWl5pN5W2MySxWmMmOfj354dek8_LWl8BtZRMvBA6ItPgA81JRFZKd7iiTOt6AaQgAknDKyRGyXsKVDglcEj5jLCD76FBit4HY2yGwuiFFKgTvLWDMXgR8UfOe6Gd_XbDQHLxl1VZG9LSIZC1eHZGaJJk-NJfJFTHg0TV2a1Q6vHZSVqewmEbAvG9EAbgIt4EljAVpq8cEo8vsXjo3EDYdGi215kLd8igNgUKM1HFd1-',
    desc: 'Often called Earth\'s twin due to similar size and mass, Venus has a runaway greenhouse effect, making its surface hot enough to melt lead. It rotates backwards (retrograde) compared to most planets.',
    details: {
      atmosphere: '96% Carbon Dioxide, thick clouds of sulfuric acid.',
      surface: 'Volcanic plains, vast mountain ranges, crushing atmospheric pressure.',
      tempRange: '462°C (Constant)'
    },
    interior: [
      { name: 'Crust', thickness: '30-50 km', composition: 'Silicates and basaltic rock' },
      { name: 'Mantle', thickness: '3000 km', composition: 'Rocky silicate mantle' },
      { name: 'Core', thickness: '3000 km', composition: 'Iron-nickel semi-solid core' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: '0 to 65km height. Contains 99% of Venusian air mass, dominated by hot, highly pressurized CO2 and violent hurricane winds.' },
      { name: 'Mesosphere', description: '65 to 120km height. Home to opaque clouds of sulfur dioxide and concentrated sulfuric acid droplets.' }
    ],
    aiAnomalies: 'Super-rotation in upper atmosphere detected. High concentration of phosphine gas compounds scanned in the cloud decks, suggesting possible complex atmospheric chemical reactions.'
  },
  {
    id: 'earth',
    name: 'Earth',
    classification: 'TERRESTRIAL',
    mass: '5.97',
    diameter: '12,756 km',
    gravity: '9.8 m/s²',
    moons: 1,
    distanceFromSun: '1.00 AU',
    orbitPeriod: '365 Days',
    escapeVelocity: '11.19 km/s',
    orbitalSpeed: '29.8 km/s',
    rotationSpeed: '1,670 km/h at equator',
    composition: '32% Iron, 30% Oxygen, 15% Silicon, 14% Magnesium, and active liquid oceans.',
    magneticField: 'Strong dipolar magnetic field generated by convective motions of molten iron in the outer core (Geodynamo).',
    geologicalInfo: 'Active plate tectonics causing mountain ranges, continental drift, oceanic trenches, and widespread volcanic subduction belts.',
    discoveryHistory: 'Home world. Tectonics and climate cataloged in detail by early terrestrial cartographers and astronomers.',
    explorationMissions: ['DSCOVR (Deep Space Climate Observatory)', 'NASA EOS (Earth Observing System)', 'Sentinel fleet (ESA space agency)'],
    funFacts: [
      'Earth is the only known planet in the universe to support liquid water on its surface.',
      'The planet\'s magnetic field interacts with solar winds to create auroras near the polar circles.',
      'Our atmosphere protects us from meteoroids, most of which burn up before hitting the surface.'
    ],
    color: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCifh8qOr_qgaj7KmWW-pwwgQqxFJuGIEImtBNNkxWQxXh5WGyU8y_TK_-EzbZ67PE7jjTGoS37-B2Od7zfY6qCdHoJsSr3UV_sEP23lNiLvIr_SaFbmoN1ZOuYWSUOa09AYJAefSSaEpgRlWVMAHkW42zX5eWyGAodgn5ShxM6vK0AC52ReVI_90XTjbwXoe0qdTCUI2FIHtzushKkXDjjL43bau_gb7Tc5K4bHdwl1AjzSO0EF-Ic',
    desc: 'Our home planet, and the only known world in the universe to support life. Earth is covered in 70% liquid oceans and possesses a strong magnetic shield protecting it from solar radiation.',
    details: {
      atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon.',
      surface: 'Tectonic plates, oceans, continents, diverse ecosystems.',
      tempRange: '-89°C to 58°C'
    },
    interior: [
      { name: 'Crust', thickness: '5-70 km', composition: 'Basalt (oceanic) and Granite (continental)' },
      { name: 'Mantle', thickness: '2890 km', composition: 'Silicates rich in iron and magnesium' },
      { name: 'Outer Core', thickness: '2260 km', composition: 'Liquid iron-nickel alloy' },
      { name: 'Inner Core', thickness: '1220 km', composition: 'Solid crystalline iron-nickel' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: '0 to 12km. Contains nearly all weather systems and cloud structures.' },
      { name: 'Stratosphere', description: '12 to 50km. Contains the Ozone Layer that absorbs ultraviolet solar radiation.' },
      { name: 'Mesosphere', description: '50 to 85km. Coldest layer where meteors vaporize upon entry.' },
      { name: 'Thermosphere', description: '85 to 600km. Spacecraft and ISS orbit here; home to polar auroras.' }
    ],
    aiAnomalies: 'Extensive magnetosphere perturbations observed at poles. Biogenic signature telemetry is highly concentrated, showing stable industrial carbon cycles and dense planetary network activity.'
  },
  {
    id: 'mars',
    name: 'Mars',
    classification: 'TERRESTRIAL',
    mass: '0.642',
    diameter: '6,792 km',
    gravity: '3.7 m/s²',
    moons: 2,
    distanceFromSun: '1.52 AU',
    orbitPeriod: '687 Days',
    escapeVelocity: '5.03 km/s',
    orbitalSpeed: '24.1 km/s',
    rotationSpeed: '868 km/h at equator',
    composition: 'Silicate rocks, iron oxides (causing the reddish dust), and basaltic mantle.',
    magneticField: 'No global magnetosphere; patches of crustal magnetization remain, representing relic fields from an ancient active dynamo.',
    geologicalInfo: 'Features Olympus Mons (tallest volcano in solar system), Valles Marineris (massive canyon system), and ancient river outflow channels.',
    discoveryHistory: 'Visible to the naked eye as a red star since antiquity. Galileo made the first telescopic drawings of Mars in 1610.',
    explorationMissions: ['Viking 1 & 2 (1976 landers)', 'Pathfinder & Sojourner (1997)', 'Curiosity & Perseverance Rovers (active)'],
    funFacts: [
      'Mars is home to Olympus Mons, a volcano three times taller than Mount Everest!',
      'Liquid water cannot exist on the surface of Mars due to its extremely thin atmosphere.',
      'Mars has two tiny moons, Phobos and Deimos, which are thought to be captured asteroids.'
    ],
    color: '#ff7043',
    glowColor: 'rgba(255, 112, 67, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Oux6Db_JI3cvO3jUGbirs9f-JNrIA_AOOdTDiwWaW8B3VkDcREUyLYHUosh21btiZEduUjCTMKnz8rVxp3GttCw_pgMX1Ak9cdEzVJosJOry4mI0rS6damWtGYj2wE3Rx2P5LmEZdBNminYFVZgFEK4EheDq-NQdEJdj0PQvHPH0YIFWB80vad-lidNQdJXGCDS0Yl4U91Q08O-wGaHh3GoZ_3tBBt-C7cDYNQfEk4lMsL17HS2B',
    desc: 'The Red Planet, a cold and desert-like world with a thin carbon dioxide atmosphere. Mars features ancient volcanoes like Olympus Mons and polar ice caps composed of water and dry ice.',
    details: {
      atmosphere: '95% Carbon Dioxide, trace nitrogen and argon.',
      surface: 'Iron-oxide dust, canyons, ancient lake beds, polar ice caps.',
      tempRange: '-140°C to 20°C'
    },
    interior: [
      { name: 'Crust', thickness: '50 km', composition: 'Basaltic rock and iron-rich dust' },
      { name: 'Mantle', thickness: '1600 km', composition: 'Silicates' },
      { name: 'Core', thickness: '1800 km', composition: 'Solid iron, nickel, and sulfur' }
    ],
    atmosphereLayers: [
      { name: 'Exosphere / Upper Atmosphere', description: 'Extremely thin layer leaking gases into space. Methane fluctuations observed.' }
    ],
    aiAnomalies: 'Subsurface liquid water deposits mapped near Valles Marineris. Occasional localized methane spikes detected, suggesting potential subterranean microbial active reservoirs.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    classification: 'GAS GIANT',
    mass: '1,898.00',
    diameter: '142,984 km',
    gravity: '24.8 m/s²',
    moons: 95,
    distanceFromSun: '5.20 AU',
    orbitPeriod: '12 Years',
    escapeVelocity: '59.5 km/s',
    orbitalSpeed: '13.1 km/s',
    rotationSpeed: '45,300 km/h (Ten-hour day)',
    composition: 'Mostly hydrogen (90%) and helium (10%) with trace amounts of methane and ammonia.',
    magneticField: 'Strongest magnetic field in the solar system, 14 times stronger than Earth\'s, generated by convective currents in its liquid metallic hydrogen layer.',
    geologicalInfo: 'No solid surface; atmosphere grades into a high-pressure liquid metallic hydrogen ocean. Active cyclones and giant swirling storms.',
    discoveryHistory: 'Tracked by ancient civilizations. Galilean satellites discovered by Galileo in 1610, establishing orbital dynamics.',
    explorationMissions: ['Pioneer 10 & 11 (1973-1974 flybys)', 'Voyager 1 & 2 (1979)', 'Galileo (1995-2003 orbiter)', 'Juno (active orbiter)'],
    funFacts: [
      'Jupiter is so massive that it is twice as heavy as all the other planets in our solar system combined!',
      'The Great Red Spot is a persistent high-pressure storm system wider than Earth that has raged for at least 300 years.',
      'It has the shortest day of all the planets, spinning once every 9.9 hours.'
    ],
    color: '#ffe082',
    glowColor: 'rgba(255, 224, 130, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB21SG_udOsn4_n8X-499L9vnNlO9VY0sYqk7MiSKVxVIIX5X8N9v2uCco-iH6qJ-6S4_WAASAhEtOaceTdzuRRQiPpH9ivE2WFn8UtsSNeWKdSPCNLnLxnCd-6shTynVj1LyrfUZpVZsDMjbIwXqgT-lye26e6yEc7ZBoHvVocJuZ62DAoCvaFQcXgW5-IF3mjV-OF_2F3oyQoSHRa9j-OaYlej75G6nT0S4LAizDJmSZNLnUOCEOr',
    desc: 'The largest planet in our solar system, Jupiter is a massive gas giant with no solid surface. It is famous for its colorful bands of ammonia clouds and the Great Red Spot—a storm wider than Earth.',
    details: {
      atmosphere: '90% Hydrogen, 10% Helium.',
      surface: 'No solid surface; liquid metallic hydrogen ocean surrounding a rocky core.',
      tempRange: '-108°C (Average)'
    },
    interior: [
      { name: 'Outer Atmosphere', thickness: '5000 km', composition: 'Gaseous molecular hydrogen' },
      { name: 'Mantle', thickness: '40000 km', composition: 'Liquid metallic hydrogen' },
      { name: 'Core', thickness: '14000 km', composition: 'Rocky, metallic, and ice diffuse core' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: 'Outer visible clouds made of ammonia crystals, ammonium hydrosulfide, and water ice.' }
    ],
    aiAnomalies: 'Extremely high magnetic field radiation detected. Gravitational telemetry indicates a diffuse core, likely dissolved by surrounding metallic hydrogen under massive pressure.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    classification: 'GAS GIANT',
    mass: '568.00',
    diameter: '120,536 km',
    gravity: '10.4 m/s²',
    moons: 146,
    distanceFromSun: '9.58 AU',
    orbitPeriod: '29 Years',
    escapeVelocity: '35.5 km/s',
    orbitalSpeed: '9.7 km/s',
    rotationSpeed: '35,500 km/h',
    composition: 'Hydrogen (96%), Helium (3%), and traces of methane, ammonia, and ethane.',
    magneticField: 'Symmetric dipolar magnetic field, slightly weaker than Earth\'s field at the equator, generated by liquid metallic hydrogen currents.',
    geologicalInfo: 'Highly reflective rings composed of 99.8% pure water ice particles ranging from dust grains to house-sized boulders.',
    discoveryHistory: 'Tracked since prehistoric times. Galileo first observed the rings in 1610, famously mistaking them for triple planets.',
    explorationMissions: ['Pioneer 11 (1979 flyby)', 'Voyager 1 & 2 (1980-1981)', 'Cassini-Huygens (2004-2017 orbital mapping)'],
    funFacts: [
      'Saturn has the lowest density of all planets; it could float in a giant bathtub!',
      'The rings are extremely thin, averaging only 10 meters in thickness despite spanning 280,000 kilometers in width.',
      'A persistent hexagonal jet stream storm system sits over Saturn\'s north pole.'
    ],
    color: '#e0a96d',
    glowColor: 'rgba(224, 169, 109, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2_HWTZutXE70W6GGR31vS4MgpGvqMYTRtEZ7Rvmd6onvvwfWu63aYwe1Q3ogEnHwcmsrcIk2qR-AFzX3Opo0l9NynML16i9UChSN2qgo46GA_LQvUE0ljGtt198z6WFbwi4wBSqADFhY2hnYhhl1L5j_vdBnI1lCzHNd5PjjcXwx-04HwHJxxrFlHCY8ILbbbfnW4y92EN9uIBIs9aCa3InCVVNbMnzR7f-CPzvjNF_j1pL2h5FI_',
    desc: 'Famous for its magnificent ring system made of billions of ice particles, rocky debris, and dust. Saturn is the least dense planet, and would float in water if a bathtub big enough existed.',
    details: {
      atmosphere: '96% Hydrogen, 3% Helium, trace methane.',
      surface: 'Gaseous outer layers, liquid hydrogen mantle, core of ice and rock.',
      tempRange: '-139°C (Average)'
    },
    interior: [
      { name: 'Outer Layers', thickness: '10000 km', composition: 'Gaseous molecular hydrogen' },
      { name: 'Mantle', thickness: '30000 km', composition: 'Liquid metallic hydrogen' },
      { name: 'Core', thickness: '12000 km', composition: 'Dense rock, iron, and ice core' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: 'Hazes of phosphine and clouds of ammonia crystals obscuring lower water cloud decks.' }
    ],
    aiAnomalies: 'Hexagonal storm at northern pole exhibits stable geometric boundaries. Rings are losing mass rapidly, estimated to completely dissolve due to ring rain in 100 million years.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    classification: 'ICE GIANT',
    mass: '86.8',
    diameter: '51,118 km',
    gravity: '8.7 m/s²',
    moons: 28,
    distanceFromSun: '19.20 AU',
    orbitPeriod: '84 Years',
    escapeVelocity: '21.3 km/s',
    orbitalSpeed: '6.8 km/s',
    rotationSpeed: '-9,320 km/h (Retrograde / 98-degree tilt)',
    composition: 'Mantle of water, ammonia, and methane ices; rock-iron core. Methane gives its atmosphere its pale blue-green color.',
    magneticField: 'Asymmetric magnetic field tilted at 59 degrees to the rotation axis and offset from the center by a third of the planetary radius.',
    geologicalInfo: 'Faint vertical ring system (13 known rings) and Miranda moon showing massive fault canyons (Verona Rupes).',
    discoveryHistory: 'First planet discovered in modern history. Spotted by William Herschel in 1781 using a home-built telescope.',
    explorationMissions: ['Voyager 2 (1986 flyby, only spacecraft visit)'],
    funFacts: [
      'Uranus is the only planet that spins practically sideways, orbiting the Sun like a rolling bowling ball.',
      'Because of its extreme axial tilt, each pole experiences 42 years of continuous sunlight followed by 42 years of darkness.',
      'It has the coldest planetary atmosphere in the solar system, dropping as low as -224°C.'
    ],
    color: '#80deea',
    glowColor: 'rgba(128, 222, 234, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC58R1-B4zofQ16MZftbfaww7DW5VpOPtEJIQLV5h5CJ_vkOw5NSpPUyUZPtBem3S1z2k0E3TaLs95MJ7KEvw64pNh7veMy_Wj3eo65HtuLHQnuACHvjlnm5_NLkH6s15wmXKzl9qdUyAlnPuvwhkQA1V0OxRbDZVD0Iru98MGZ4BZagZvagws5Ejvanoq5AaeSeIMwLohtc-9Hw-GMHloC06DIsalPPjju07O4VUbWiQ5F10GGDZn1',
    desc: 'An ice giant that appears blue-green due to methane gas. Uranus is unique for rotating on its side at an extreme 98-degree tilt, likely due to a massive collision early in its history.',
    details: {
      atmosphere: '82.5% Hydrogen, 15.2% Helium, 2.3% Methane.',
      surface: 'Mantle of water, ammonia, and methane ices; rock-iron core.',
      tempRange: '-197°C (Average)'
    },
    interior: [
      { name: 'Atmosphere', thickness: '5000 km', composition: 'Hydrogen and helium gas' },
      { name: 'Mantle', thickness: '20000 km', composition: 'Water, ammonia, and methane ice slush' },
      { name: 'Core', thickness: '5000 km', composition: 'Iron, nickel, and silicate rock core' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: 'Lowest atmospheric layer with clouds of methane and hydrogen sulfide.' }
    ],
    aiAnomalies: 'Extreme offset and tilt of magnetic poles scanned (59 degrees from rotational axis). Extremely low thermal emission levels recorded, suggesting locked interior convection currents.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    classification: 'ICE GIANT',
    mass: '102.0',
    diameter: '49,528 km',
    gravity: '11.1 m/s²',
    moons: 16,
    distanceFromSun: '30.05 AU',
    orbitPeriod: '165 Years',
    escapeVelocity: '23.5 km/s',
    orbitalSpeed: '5.4 km/s',
    rotationSpeed: '9,660 km/h',
    composition: 'Slushy mantle of water, ammonia, and methane ice; rock-nickel core.',
    magneticField: 'Tilted magnetic axis at 47 degrees to its rotation axis, offset from the center by 0.55 radii.',
    geologicalInfo: 'Winds reach up to 2,100 km/h. Active weather storms including the Great Dark Spot and Scooter clouds.',
    discoveryHistory: 'First planet discovered by mathematical prediction rather than direct observation. Mathematically calculated by Urbain Le Verrier and observed by Johann Galle in 1846.',
    explorationMissions: ['Voyager 2 (1989 flyby, only spacecraft visit)'],
    funFacts: [
      'Neptune has the fastest winds in the solar system, reaching supersonic speeds faster than a fighter jet!',
      'Due to its high gravity and pressure, it is hypothesized that it literally rains diamonds deep inside Neptune\'s mantle.',
      'Neptune\'s largest moon, Triton, is the only large moon in the solar system that orbits in the opposite direction of its planet\'s rotation.'
    ],
    color: '#3f51b5',
    glowColor: 'rgba(63, 81, 181, 0.4)',
    imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgfq4ZaqoKbSqz9Esbe_yURmp6ycNVyPrfSQmh_IEhtgrUAqj6WOe5CsngZS6keRD-Wc1NSdXCB-QMnafnkliSR4aEuQjVAoDvQkacyDhx272mFzMTbdaVJbyB0XxjlHhkDxfo5Czi9nSgU_isvYlQXAdHdZVPQdRJUDVBCol6GaV0JhrOmsB4nf-EoHxIYiH8u-qQT0NJbYFBfaQyQcyn7GplIFzV-rexQcnD96a3RTfuOwYgQkUD',
    desc: 'The most distant planet in our solar system, Neptune is a dark, cold ice giant whipped by supersonic winds exceeding 2,100 km/h. It features active storms like the Great Dark Spot.',
    details: {
      atmosphere: '80% Hydrogen, 19% Helium, 1.5% Methane.',
      surface: 'Water-ammonia slush ocean, silicate-nickel core.',
      tempRange: '-201°C (Average)'
    },
    interior: [
      { name: 'Atmosphere', thickness: '5000 km', composition: 'Hydrogen, helium, and methane gas' },
      { name: 'Mantle', thickness: '18000 km', composition: 'Water, ammonia, and methane ices' },
      { name: 'Core', thickness: '6000 km', composition: 'Silicates and metals core' }
    ],
    atmosphereLayers: [
      { name: 'Troposphere', description: 'Dense cloud decks of methane ice crystals and ammonium sulfide.' }
    ],
    aiAnomalies: 'Internal heat generator produces 2.6 times more energy than it receives from the sun. Telemetry scanned extreme supersonic jet streams, driven by mysterious internal core thermal gradients.'
  }
];
