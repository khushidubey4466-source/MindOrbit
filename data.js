/* MindOrbit sample knowledge data.
   Each concept: n = name, s = simple explanation, p = key points, r = related concept indexes. */
const C = (n, s, p, r) => ({ n, s, p, r });
const SAMPLE_TOPICS = [
  { id: 'ai', name: 'Artificial Intelligence', emoji: '🤖', hue: 265, desc: 'Machines that learn, see and reason.', concepts: [
    C('Machine Learning', 'Algorithms that improve by finding patterns in data instead of following fixed rules.', ['Learns from examples', 'Quality data matters most', 'Powers recommendations'], [1, 2]),
    C('Neural Networks', 'Layers of connected math units, loosely inspired by brain cells, that learn complex patterns.', ['Built from layers of nodes', 'Weights adjust during training', 'Deep networks have many layers'], [0, 3]),
    C('Natural Language Processing', 'Teaching computers to read, interpret and generate human language.', ['Used in translation and chat', 'Splits text into tokens', 'Context decides meaning'], [0, 4]),
    C('Computer Vision', 'Helping computers understand images and video.', ['Detects objects and faces', 'Used in medical imaging', 'Relies on convolutional networks'], [1]),
    C('AI Ethics', 'The study of fairness, privacy and safety when building intelligent systems.', ['Bias can come from data', 'Transparency builds trust', 'Humans stay accountable'], [0, 2]) ] },
  { id: 'space', name: 'Space Science', emoji: '🪐', hue: 215, desc: 'Planets, stars and the cosmos beyond.', concepts: [
    C('Solar System', 'The Sun and everything bound to it by gravity, including eight planets.', ['Sun holds 99% of the mass', 'Planets orbit in ellipses', 'Asteroids fill a belt'], [1, 4]),
    C('Stars', 'Giant balls of gas that shine by fusing hydrogen into helium.', ['Born in nebulae', 'Color shows temperature', 'Massive stars end as supernovae'], [0, 2]),
    C('Black Holes', 'Regions where gravity is so strong that not even light can escape.', ['Edge is the event horizon', 'Form from collapsed stars', 'Bend space and time'], [1, 3]),
    C('Galaxies', 'Huge systems of stars, gas and dust held together by gravity.', ['Our home is the Milky Way', 'Shapes include spirals', 'Billions exist in the universe'], [2]),
    C('Space Exploration', 'Using rockets, probes and telescopes to study space and travel beyond Earth.', ['Sputnik launched in 1957', 'Probes visit distant planets', 'Telescopes look back in time'], [0, 3]) ] },
  { id: 'brain', name: 'Human Brain', emoji: '🧠', hue: 300, desc: 'The organ that thinks, feels and remembers.', concepts: [
    C('Neurons', 'Specialized cells that send electrical and chemical signals around the body.', ['About 86 billion in the brain', 'Connect through synapses', 'Signals travel along axons'], [1, 3]),
    C('Memory', 'The brain’s ability to store and recall information and experiences.', ['Short-term holds few items', 'Long-term lasts years', 'Repetition strengthens it'], [0, 4]),
    C('Cerebral Cortex', 'The wrinkled outer layer of the brain that handles thought, language and perception.', ['Folds increase surface area', 'Has four main lobes', 'Frontal lobe plans actions'], [0]),
    C('Neuroplasticity', 'The brain’s power to rewire itself by forming new connections.', ['Learning changes the brain', 'Helps recovery after injury', 'Practice builds pathways'], [0, 1]),
    C('Sleep and Dreams', 'A nightly state when the brain rests, repairs and sorts memories.', ['REM sleep brings vivid dreams', 'Consolidates memories', 'Adults need 7 to 9 hours'], [1]) ] },
  { id: 'cs', name: 'Computer Science', emoji: '💻', hue: 190, desc: 'How computers solve problems with logic.', concepts: [
    C('Algorithms', 'Step-by-step instructions for solving a problem or completing a task.', ['Must finish in finite steps', 'Efficiency is measured by Big O', 'Sorting is a classic example'], [1, 2]),
    C('Data Structures', 'Ways of organizing data, such as lists and trees, so it can be used efficiently.', ['Arrays store ordered items', 'Hash maps give fast lookup', 'Trees model hierarchies'], [0]),
    C('Programming Languages', 'Formal languages used to give instructions to a computer.', ['Compiled or interpreted', 'Python is beginner friendly', 'Syntax defines the rules'], [0, 3]),
    C('Operating Systems', 'Software that manages hardware and runs your apps.', ['Schedules processes', 'Manages memory and files', 'Examples: Windows, Linux'], [2, 4]),
    C('Computer Networks', 'Connected devices that share data, like the internet.', ['Packets carry data', 'IP addresses identify devices', 'Protocols set the rules'], [3]) ] },
  { id: 'physics', name: 'Physics', emoji: '⚛️', hue: 245, desc: 'The rules behind matter, energy and motion.', concepts: [
    C('Gravity', 'The force that pulls objects with mass toward each other.', ['Keeps planets in orbit', 'Stronger with more mass', 'Described by Newton and Einstein'], [1, 3]),
    C('Energy', 'The ability to do work, which changes form but is never destroyed.', ['Kinetic is energy of motion', 'Potential is stored energy', 'Total energy is conserved'], [0, 4]),
    C('Quantum Mechanics', 'The physics of atoms and particles, where outcomes are probabilities.', ['Light acts as wave and particle', 'Energy comes in quanta', 'Measurement affects results'], [1]),
    C('Relativity', 'Einstein’s theory linking space, time, gravity and the speed of light.', ['Nothing outruns light', 'Time slows near mass', 'Mass curves spacetime'], [0]),
    C('Electromagnetism', 'The force between electric charges and magnets.', ['Light is an EM wave', 'Moving charges make magnetic fields', 'Powers motors and generators'], [1, 2]) ] },
  { id: 'math', name: 'Mathematics', emoji: '📐', hue: 280, desc: 'The language of patterns and logic.', concepts: [
    C('Algebra', 'Using letters and symbols to represent unknown numbers and relationships.', ['Variables stand for values', 'Equations balance both sides', 'Used to model real problems'], [2, 4]),
    C('Geometry', 'The study of shapes, sizes, angles and space.', ['Pythagorean theorem for triangles', 'Circles use pi', 'Angles in a triangle sum to 180°'], [0]),
    C('Calculus', 'Mathematics of change and accumulation, using derivatives and integrals.', ['Derivatives give rates of change', 'Integrals add up area', 'Invented by Newton and Leibniz'], [0, 3]),
    C('Probability', 'Measuring how likely events are to happen.', ['Values range from 0 to 1', 'Independent events do not affect each other', 'Basis of statistics'], [2]),
    C('Number Theory', 'The study of whole numbers and their special properties.', ['Primes are the building blocks', 'Used in encryption', 'Fibonacci is a famous pattern'], [0]) ] }
];