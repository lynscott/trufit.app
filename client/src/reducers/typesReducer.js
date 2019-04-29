export default function() {
  return [
    {
      type: 'Ectomorph',
      info:
        'Lean/thin build, but slim on muscle. You likely struggle to gain weight, as either body fat or muscle, despite hours in the gym or relatively constant eating. Physical characteristics include long limbs, narrow shoulders, and slim wrist and ankle joints.',
      macro: { carb: 50, protein: 30, fat: 20 }
    },
    {
      type: 'Mesomorph',
      info:
        'You have a natural tendency to be fit and relatively muscular. Physical characteristics include wide shoulders, a narrow waist, and relatively thin joints. Natural "V-taper" for men or "hourglass figure" for women.',
      macro: { carb: 40, protein: 30, fat: 30 }
    },
    {
      type: 'Endomorph',
      info:
        'You tend to gain weight and keep it on. May often struggle to gain muscle without significant amounts of accompanying body fat. Physical characteristics include thick rib cage, wide hips, and shorter limbs.',
      macro: { carb: 25, protein: 35, fat: 40 }
    }
  ]
}
