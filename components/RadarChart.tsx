'use client'

import { useEffect, useRef, useState } from 'react'

interface Axis {
  key: string
  label: string
  score: number
  color: string
}

interface Props {
  axes: Axis[]
  size?: number
}

const toRad = (deg: number) => (deg * Math.PI) / 180

/** 计算正多边形各顶点坐标（从顶部开始，顺时针） */
function polyPoints(n: number, r: number, cx: number, cy: number) {
  return Array.from({ length: n }, (_, i) => {
    const angle = toRad(-90 + (360 / n) * i)
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
}

export default function RadarChart({ axes, size = 240 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size * 0.38
  const n = axes.length
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80)
    return () => clearTimeout(timer)
  }, [])

  // 各层背景网格（20%, 40%, 60%, 80%, 100%）
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0]

  // 外层顶点（100%）
  const outerPts = polyPoints(n, maxR, cx, cy)

  // 数据多边形顶点（按实际分数，0-100 → 0-maxR）
  const dataPts = axes.map((axis, i) => {
    const r = maxR * (animated ? axis.score / 100 : 0)
    const angle = toRad(-90 + (360 / n) * i)
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 背景网格层 */}
      {levels.map((lvl, li) => {
        const pts = polyPoints(n, maxR * lvl, cx, cy)
        return (
          <polygon
            key={li}
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        )
      })}

      {/* 轴线 */}
      {outerPts.map((pt, i) => (
        <line
          key={i}
          x1={cx} y1={cy}
          x2={pt.x} y2={pt.y}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}

      {/* 数据多边形（带 CSS transition） */}
      <path
        d={toPath(dataPts)}
        fill="url(#radarFill)"
        stroke="#d4af37"
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
      />

      {/* 数据点 */}
      {dataPts.map((pt, i) => (
        <circle
          key={i}
          cx={pt.x} cy={pt.y} r={3}
          fill={axes[i].color}
          style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
      ))}

      {/* 轴标签 */}
      {outerPts.map((pt, i) => {
        const labelR = maxR + 18
        const angle = toRad(-90 + (360 / n) * i)
        const lx = cx + labelR * Math.cos(angle)
        const ly = cy + labelR * Math.sin(angle)
        const score = axes[i].score
        return (
          <g key={i}>
            <text
              x={lx} y={ly - 4}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9}
              fill={axes[i].color}
              fontWeight="600"
            >
              {axes[i].label}
            </text>
            <text
              x={lx} y={ly + 7}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={9}
              fill="rgba(255,255,255,0.45)"
            >
              {score}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
