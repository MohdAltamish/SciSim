export const experiments = [
  {
    id: 'pendulum',
    name: 'Simple Pendulum',
    description: 'Adjust length, mass, and initial angle to observe oscillation and period.',
    variables: {
      length: { min: 0.5, max: 3, default: 1.5, step: 0.1, unit: 'm', label: 'Length' },
      mass: { min: 0.1, max: 5, default: 1, step: 0.1, unit: 'kg', label: 'Mass' },
      angle: { min: 5, max: 80, default: 30, step: 1, unit: '°', label: 'Initial angle' },
      gravity: { min: 1, max: 20, default: 9.81, step: 0.1, unit: 'm/s²', label: 'Gravity' },
    },
  },
  {
    id: 'projectile',
    name: 'Projectile Motion',
    description: 'Set angle and initial velocity to trace a parabolic path.',
    variables: {
      velocity: { min: 5, max: 50, default: 20, step: 1, unit: 'm/s', label: 'Initial velocity' },
      angle: { min: 5, max: 85, default: 45, step: 1, unit: '°', label: 'Launch angle' },
      gravity: { min: 1, max: 20, default: 9.81, step: 0.1, unit: 'm/s²', label: 'Gravity' },
    },
  },
  {
    id: 'waves',
    name: 'Wave Interference',
    description: 'Two wave sources — visualize constructive and destructive interference.',
    variables: {
      wavelength: { min: 10, max: 80, default: 40, step: 1, unit: 'px', label: 'Wavelength' },
      frequency: { min: 0.5, max: 5, default: 2, step: 0.1, unit: 'Hz', label: 'Frequency' },
      amplitude: { min: 0.2, max: 1, default: 0.5, step: 0.05, unit: '', label: 'Amplitude' },
    },
  },
]
