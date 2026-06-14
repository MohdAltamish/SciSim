import { useRef, useEffect } from 'react'
import p5 from 'p5'

export default function SimCanvas({ experimentId, variables }) {
  const canvasRef = useRef(null)
  const p5Ref = useRef(null)
  const varsRef = useRef(variables)

  useEffect(() => {
    varsRef.current = variables
  }, [variables])

  useEffect(() => {
    if (!canvasRef.current) return
    if (p5Ref.current) p5Ref.current.remove()

    const sketch = (p) => {
      let theta, omega, trail
      let projX, projY, projTrail, projLaunched, projTime
      let waveTime

      p.setup = () => {
        const canvas = p.createCanvas(canvasRef.current.offsetWidth, 420)
        canvas.parent(canvasRef.current)
        p.textFont('Inter, system-ui, sans-serif')
        resetSim()
      }

      function resetSim() {
        const vars = varsRef.current
        // Pendulum
        theta = ((vars.angle || 30) * Math.PI) / 180
        omega = 0
        trail = []
        // Projectile
        projLaunched = false
        projTime = 0
        projTrail = []
        projX = 0
        projY = 0
        // Waves
        waveTime = 0
      }

      p.draw = () => {
        p.background(255)
        const vars = varsRef.current

        if (experimentId === 'pendulum') drawPendulum(p, vars)
        else if (experimentId === 'projectile') drawProjectile(p, vars)
        else if (experimentId === 'waves') drawWaves(p, vars)
        else {
          p.fill(180)
          p.noStroke()
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(16)
          p.text('Select an experiment', p.width / 2, p.height / 2)
        }
      }

      function drawPendulum(p, vars) {
        const L = (vars.length || 1.5) * 100
        const g = (vars.gravity || 9.81) * 10
        const mass = vars.mass || 1
        const dt = 0.016

        // Physics
        const alpha = -(g / L) * Math.sin(theta)
        omega += alpha * dt
        omega *= 0.999 // Small damping
        theta += omega * dt

        const pivotX = p.width / 2
        const pivotY = 60
        const bobX = pivotX + L * Math.sin(theta)
        const bobY = pivotY + L * Math.cos(theta)

        // Trail
        trail.push({ x: bobX, y: bobY })
        if (trail.length > 40) trail.shift()

        // Draw trail
        for (let i = 0; i < trail.length; i++) {
          const alpha = p.map(i, 0, trail.length, 20, 150)
          p.fill(74, 108, 247, alpha)
          p.noStroke()
          p.circle(trail[i].x, trail[i].y, p.map(i, 0, trail.length, 2, 6))
        }

        // String
        p.stroke(120)
        p.strokeWeight(2)
        p.line(pivotX, pivotY, bobX, bobY)

        // Pivot
        p.fill(80)
        p.noStroke()
        p.circle(pivotX, pivotY, 10)

        // Bob
        const bobSize = 16 + mass * 6
        p.fill(74, 108, 247)
        p.noStroke()
        p.circle(bobX, bobY, bobSize)

        // Period display
        const period = 2 * Math.PI * Math.sqrt((vars.length || 1.5) / (vars.gravity || 9.81))
        drawReadout(p, [
          { label: 'Period', value: `${period.toFixed(2)}s` },
          { label: 'Length', value: `${(vars.length || 1.5).toFixed(1)}m` },
          { label: 'Angle', value: `${((theta * 180) / Math.PI).toFixed(1)}°` },
        ])
      }

      function drawProjectile(p, vars) {
        const v0 = vars.velocity || 20
        const angleDeg = vars.angle || 45
        const g = vars.gravity || 9.81
        const angleRad = (angleDeg * Math.PI) / 180
        const scale = 3

        // Ground
        p.stroke(200)
        p.strokeWeight(1)
        const groundY = p.height - 80
        p.line(0, groundY, p.width, groundY)

        // Ground pattern
        for (let i = 0; i < p.width; i += 40) {
          p.stroke(220)
          p.line(i, groundY, i + 10, groundY + 10)
        }

        const startX = 60
        const startY = groundY

        // Compute full trajectory for trace
        const totalTime = (2 * v0 * Math.sin(angleRad)) / g
        const range = v0 * Math.cos(angleRad) * totalTime * scale
        const maxH = (v0 * v0 * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * g) * scale

        // Dotted trace
        p.stroke(200)
        p.strokeWeight(1)
        for (let t = 0; t <= totalTime; t += 0.05) {
          const tx = startX + v0 * Math.cos(angleRad) * t * scale
          const ty = startY - (v0 * Math.sin(angleRad) * t - 0.5 * g * t * t) * scale
          if (tx < p.width && ty <= startY) {
            p.point(tx, ty)
          }
        }

        // Animate projectile
        if (!projLaunched) {
          // Draw launch indicator
          const arrowLen = 50
          const ax = startX + arrowLen * Math.cos(angleRad)
          const ay = startY - arrowLen * Math.sin(angleRad)
          p.stroke(74, 108, 247)
          p.strokeWeight(2)
          p.line(startX, startY, ax, ay)

          // Arrow head
          p.fill(74, 108, 247)
          p.noStroke()
          p.circle(ax, ay, 8)

          // Click to launch
          p.fill(150)
          p.noStroke()
          p.textAlign(p.CENTER)
          p.textSize(12)
          p.text('Click canvas to launch!', p.width / 2, 30)
        } else {
          projTime += 0.016 * 2
          projX = startX + v0 * Math.cos(angleRad) * projTime * scale
          projY = startY - (v0 * Math.sin(angleRad) * projTime - 0.5 * g * projTime * projTime) * scale

          // Trail
          projTrail.push({ x: projX, y: projY })

          // Draw trail
          for (let i = 0; i < projTrail.length; i++) {
            const a = p.map(i, 0, projTrail.length, 30, 200)
            p.fill(74, 108, 247, a)
            p.noStroke()
            p.circle(projTrail[i].x, projTrail[i].y, 4)
          }

          // Projectile
          if (projY <= startY) {
            p.fill(74, 108, 247)
            p.noStroke()
            p.circle(projX, projY, 14)
          } else {
            // Landing
            p.fill(255, 87, 34)
            p.noStroke()
            p.circle(projX, startY, 10)
            p.textSize(11)
            p.text('Landing!', projX, startY + 20)
          }
        }

        // Max height marker
        const peakTime = v0 * Math.sin(angleRad) / g
        const peakX = startX + v0 * Math.cos(angleRad) * peakTime * scale
        const peakY = startY - maxH

        if (peakX < p.width) {
          p.stroke(255, 143, 0, 100)
          p.strokeWeight(1)
          p.setLineDash?.([4, 4])
          p.line(peakX, startY, peakX, peakY)

          p.fill(255, 143, 0)
          p.noStroke()
          p.textSize(10)
          p.textAlign(p.CENTER)
          p.text(`Max: ${(maxH / scale).toFixed(1)}m`, peakX, peakY - 10)
        }

        // Landing marker
        const landX = startX + range
        if (landX < p.width) {
          p.fill(76, 175, 80)
          p.noStroke()
          p.textSize(10)
          p.text(`Range: ${(range / scale).toFixed(1)}m`, landX, startY + 20)
        }

        drawReadout(p, [
          { label: 'Range', value: `${(range / scale).toFixed(1)}m` },
          { label: 'Max height', value: `${(maxH / scale).toFixed(1)}m` },
          { label: 'Time', value: `${totalTime.toFixed(2)}s` },
        ])
      }

      function drawWaves(p, vars) {
        waveTime += 0.03

        const wl = vars.wavelength || 40
        const freq = vars.frequency || 2
        const amp = vars.amplitude || 0.5

        const k = (2 * Math.PI) / wl
        const omega = 2 * Math.PI * freq

        // Source positions
        const s1x = p.width * 0.35
        const s1y = p.height * 0.5
        const s2x = p.width * 0.65
        const s2y = p.height * 0.5

        // Draw interference pattern (lower res for performance)
        const step = 4
        p.noStroke()
        for (let x = 0; x < p.width; x += step) {
          for (let y = 40; y < p.height - 60; y += step) {
            const r1 = Math.sqrt((x - s1x) ** 2 + (y - s1y) ** 2)
            const r2 = Math.sqrt((x - s2x) ** 2 + (y - s2y) ** 2)

            const d = amp * Math.sin(k * r1 - omega * waveTime) + amp * Math.sin(k * r2 - omega * waveTime)

            // Color map
            if (d > 0) {
              p.fill(74, 108, 247, Math.abs(d) * 200)
            } else {
              p.fill(255, 107, 107, Math.abs(d) * 200)
            }
            p.rect(x, y, step, step)
          }
        }

        // Source markers
        p.fill(74, 108, 247)
        p.stroke(255)
        p.strokeWeight(2)
        p.circle(s1x, s1y, 14)
        p.circle(s2x, s2y, 14)

        // Labels
        p.fill(255)
        p.noStroke()
        p.textSize(9)
        p.textAlign(p.CENTER, p.CENTER)
        p.text('S1', s1x, s1y)
        p.text('S2', s2x, s2y)

        drawReadout(p, [
          { label: 'Wavelength', value: `${(wl).toFixed(0)}px` },
          { label: 'Frequency', value: `${freq.toFixed(1)}Hz` },
          { label: 'Amplitude', value: amp.toFixed(2) },
        ])
      }

      function drawReadout(p, items) {
        const y = p.height - 35
        const spacing = 140
        const startX = (p.width - items.length * spacing) / 2 + spacing / 2

        p.textAlign(p.CENTER)
        items.forEach((item, i) => {
          const x = startX + i * spacing
          p.fill(150)
          p.textSize(10)
          p.noStroke()
          p.text(item.label, x, y)
          p.fill(50)
          p.textSize(13)
          p.textStyle(p.BOLD)
          p.text(item.value, x, y + 16)
          p.textStyle(p.NORMAL)
        })
      }

      p.mousePressed = () => {
        if (experimentId === 'projectile' && !projLaunched) {
          if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            projLaunched = true
            projTime = 0
            projTrail = []
          }
        }
      }

      p.windowResized = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.offsetWidth, 420)
        }
      }
    }

    p5Ref.current = new p5(sketch)

    return () => {
      if (p5Ref.current) p5Ref.current.remove()
    }
  }, [experimentId])

  return <div ref={canvasRef} style={{ width: '100%', minHeight: '420px' }} />
}
