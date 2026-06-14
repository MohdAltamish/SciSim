import { useRef, useEffect, useState } from 'react'
import p5 from 'p5'

export default function ReactionCanvas({ reaction, isReacting, onReactionComplete }) {
  const canvasRef = useRef(null)
  const p5Ref = useRef(null)
  const [phase, setPhase] = useState('idle') // 'idle' | 'pouring' | 'reacting' | 'done'

  useEffect(() => {
    if (isReacting && phase === 'idle') {
      setPhase('pouring')
      setTimeout(() => setPhase('reacting'), 800)
      setTimeout(() => {
        setPhase('done')
        onReactionComplete?.()
      }, 3000)
    }
  }, [isReacting])

  useEffect(() => {
    if (!canvasRef.current) return

    const sketch = (p) => {
      let particles = []
      let temperature = 25
      let mixProgress = 0
      const beakerW = 120
      const beakerH = 160

      p.setup = () => {
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, 400)
        canvas.parent(canvasRef.current)
        p.textFont('Inter')
      }

      p.draw = () => {
        p.background(255)
        const w = p.width
        const h = p.height

        if (!reaction) {
          p.fill(200)
          p.noStroke()
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(16)
          p.text('Select a reaction to visualize', w / 2, h / 2)
          return
        }

        // Update phase
        if (phase === 'reacting') {
          mixProgress = p.min(mixProgress + 0.008, 1)
          if (reaction.exothermic) {
            temperature = p.lerp(25, 85, mixProgress)
          }
        }

        // --- Beaker A ---
        const aX = w * 0.25 - beakerW / 2
        const aY = h * 0.35
        drawBeaker(p, aX, aY, beakerW, beakerH, reaction.color.before[0], 'A', reaction.reactants[0], phase !== 'idle' ? 1 - mixProgress * 0.3 : 1)

        // --- Beaker B ---
        if (reaction.reactants.length > 1) {
          const bX = w * 0.75 - beakerW / 2
          const bY = h * 0.35
          drawBeaker(p, bX, bY, beakerW, beakerH, reaction.color.before[1], 'B', reaction.reactants[1], phase !== 'idle' ? 1 - mixProgress * 0.3 : 1)
        }

        // --- Result Beaker (center) ---
        if (phase !== 'idle') {
          const rX = w * 0.5 - beakerW / 2
          const rY = h * 0.35

          // Lerp color
          const beforeColor = p.color(reaction.color.before[0])
          const afterColor = p.color(reaction.color.after)
          const currentColor = p.lerpColor(beforeColor, afterColor, mixProgress)

          drawBeaker(p, rX, rY, beakerW, beakerH, currentColor, '→', reaction.products.join(' + '), mixProgress)

          // Bubbles
          if (phase === 'reacting' || phase === 'done') {
            if (p.frameCount % 3 === 0 && particles.length < 50) {
              particles.push({
                x: rX + beakerW * 0.2 + p.random(beakerW * 0.6),
                y: rY + beakerH * 0.6,
                size: p.random(3, 8),
                speed: p.random(0.5, 2),
                alpha: 200,
              })
            }

            for (let i = particles.length - 1; i >= 0; i--) {
              const pt = particles[i]
              pt.y -= pt.speed
              pt.x += p.random(-0.3, 0.3)
              pt.alpha -= 2

              p.fill(255, 255, 255, pt.alpha)
              p.noStroke()
              p.circle(pt.x, pt.y, pt.size)

              if (pt.alpha <= 0 || pt.y < rY + 20) {
                particles.splice(i, 1)
              }
            }
          }

          // Arrow from A to center
          p.stroke(200)
          p.strokeWeight(1.5)
          p.noFill()
          const arrowY = aY + beakerH / 2
          p.line(aX + beakerW + 10, arrowY, rX - 10, arrowY)
          // Arrow from B to center
          if (reaction.reactants.length > 1) {
            const bX = w * 0.75 - beakerW / 2
            p.line(rX + beakerW + 10, arrowY, bX - 10, arrowY)
          }
        }

        // Temperature gauge
        drawTemperature(p, w - 60, h * 0.35, temperature)

        // Equation bar at bottom
        p.fill(50)
        p.noStroke()
        p.textAlign(p.CENTER)
        p.textSize(14)
        p.textStyle(p.BOLD)
        const eq = `${reaction.reactants.join(' + ')} → ${reaction.products.join(' + ')}`
        p.text(eq, w / 2, h - 30)

        // Description
        p.textSize(12)
        p.textStyle(p.NORMAL)
        p.fill(150)
        p.text(reaction.description, w / 2, h - 10)
      }

      p.windowResized = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.offsetWidth, 400)
        }
      }
    }

    p5Ref.current = new p5(sketch)

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove()
      }
    }
  }, [reaction, phase])

  // Reset phase when reaction changes
  useEffect(() => {
    setPhase('idle')
  }, [reaction?.id])

  return <div ref={canvasRef} style={{ width: '100%', minHeight: '400px' }} />
}

function drawBeaker(p, x, y, w, h, liquidColor, label, formula, fillLevel = 0.7) {
  // Glass
  p.stroke(180)
  p.strokeWeight(2)
  p.noFill()
  p.beginShape()
  p.vertex(x, y)
  p.vertex(x, y + h)
  p.vertex(x + w, y + h)
  p.vertex(x + w, y)
  p.endShape()

  // Liquid
  const liquidH = h * 0.65 * fillLevel
  if (typeof liquidColor === 'object' && liquidColor._array) {
    p.fill(liquidColor)
  } else {
    p.fill(liquidColor || '#90CAF9')
  }
  p.noStroke()
  p.rect(x + 2, y + h - liquidH - 2, w - 4, liquidH, 0, 0, 4, 4)

  // Label
  p.fill(150)
  p.noStroke()
  p.textAlign(p.CENTER)
  p.textSize(13)
  p.textStyle(p.BOLD)
  p.text(label, x + w / 2, y - 10)

  // Formula
  p.textSize(11)
  p.textStyle(p.NORMAL)
  p.fill(100)
  p.text(formula || '', x + w / 2, y + h + 18)
}

function drawTemperature(p, x, y, temp) {
  const h = 120
  const fillH = p.map(temp, 0, 100, 0, h)

  // Tube
  p.stroke(200)
  p.strokeWeight(1)
  p.noFill()
  p.rect(x - 6, y, 12, h, 6)

  // Fill
  const tempColor = temp > 50 ? p.color('#FF5722') : temp > 30 ? p.color('#FF9800') : p.color('#4A6CF7')
  p.fill(tempColor)
  p.noStroke()
  p.rect(x - 4, y + h - fillH, 8, fillH, 0, 0, 4, 4)

  // Bulb
  p.fill(tempColor)
  p.circle(x, y + h + 10, 16)

  // Label
  p.fill(100)
  p.textAlign(p.CENTER)
  p.textSize(11)
  p.textStyle(p.BOLD)
  p.text(`${Math.round(temp)}°C`, x, y - 10)
}
