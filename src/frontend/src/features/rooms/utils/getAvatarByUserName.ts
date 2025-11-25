// Простая и надёжная хеш-функция для строк
function simpleHash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return Math.abs(hash >>> 0)
}

// Генерирует детерминированное число от 0 до 1 на основе строки и индекса
function seededRandom(str: string, index: number): number {
  const hash = simpleHash(str + ':' + index)
  return (hash % 10000) / 10000
}

// Генерирует целое число от min до max (не включая max)
function randomInt(str: string, index: number, min: number, max: number): number {
  return Math.floor(seededRandom(str, index) * (max - min)) + min
}

// Генерирует float от min до max
function randomFloat(str: string, index: number, min: number, max: number): number {
  return seededRandom(str, index) * (max - min) + min
}

// Палитры цветов
const colors = [
  ['#FF6B6B', '#4ECDC4'], // красный -> бирюзовый
  ['#A8E6CF', '#FFD3B6'], // мятный -> персиковый
  ['#95E1D3', '#F38181'], // бирюзовый -> коралловый
  ['#FEC8D8', '#957DAD'], // розовый -> фиолетовый
  ['#FFD93D', '#6BCF7F'], // желтый -> зеленый
  ['#A8DADC', '#E63946'], // голубой -> красный
  ['#F4A261', '#E76F51'], // оранжевый -> терракотовый
  ['#06FFA5', '#00D4FF'], // неоново-зеленый -> голубой
  ['#FF6FB5', '#8B5CF6'], // розовый -> фиолетовый
  ['#FBBF24', '#EC4899'], // желтый -> розовый
]

// Генерация SVG паттерна на основе username
export const getAvatarByUserName = (username: string): string => {
  if (!username || username.trim() === '') {
    username = 'anonymous'
  }

  // Нормализуем username для консистентности
  const normalized = username.toLowerCase().trim()

  // Выбираем цвета
  const colorIndex = randomInt(normalized, 0, 0, colors.length)
  const [color1, color2] = colors[colorIndex]

  // Выбираем тип паттерна (0-5)
  const patternType = randomInt(normalized, 1, 0, 6)

  // Размеры
  const size = 120
  const center = size / 2

  let shapes = ''

  switch (patternType) {
    case 0: {
      // Концентрические круги
      const numCircles = randomInt(normalized, 10, 3, 6)
      for (let i = 0; i < numCircles; i++) {
        const r = (size / 2 - 10) * ((i + 1) / numCircles)
        const sw = randomFloat(normalized, 20 + i, 2, 5)
        const opacity = randomFloat(normalized, 30 + i, 0.6, 1)
        shapes += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="${i % 2 === 0 ? color1 : color2}" stroke-width="${sw}" opacity="${opacity}"/>`
      }
      break
    }

    case 1: {
      // Полигон
      const sides = randomInt(normalized, 10, 5, 9)
      const layers = randomInt(normalized, 11, 2, 4)
      for (let layer = 0; layer < layers; layer++) {
        const r = (size / 2 - 10) * ((layer + 1) / layers) * randomFloat(normalized, 20 + layer, 0.85, 1)
        const rotation = randomFloat(normalized, 30 + layer, 0, 360)
        let points = ''
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 + (rotation * Math.PI / 180)
          const x = center + Math.cos(angle) * r
          const y = center + Math.sin(angle) * r
          points += `${x},${y} `
        }
        const sw = randomFloat(normalized, 40 + layer, 2, 4)
        const opacity = randomFloat(normalized, 50 + layer, 0.7, 0.95)
        shapes += `<polygon points="${points}" fill="none" stroke="${layer % 2 === 0 ? color1 : color2}" stroke-width="${sw}" opacity="${opacity}"/>`
      }
      break
    }

    case 2: {
      // Звезда / лучи
      const rays = randomInt(normalized, 10, 8, 16)
      for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2
        const len = randomFloat(normalized, 20 + i, 0.6, 0.9) * (size / 2 - 10)
        const x2 = center + Math.cos(angle) * len
        const y2 = center + Math.sin(angle) * len
        const sw = randomFloat(normalized, 40 + i, 2, 5)
        const opacity = randomFloat(normalized, 60 + i, 0.6, 0.9)
        shapes += `<line x1="${center}" y1="${center}" x2="${x2}" y2="${y2}" stroke="${i % 2 === 0 ? color1 : color2}" stroke-width="${sw}" opacity="${opacity}" stroke-linecap="round"/>`
      }
      break
    }

    case 3: {
      // Волны
      const waves = randomInt(normalized, 10, 4, 7)
      for (let w = 0; w < waves; w++) {
        const amp = randomFloat(normalized, 20 + w, 8, 20)
        const freq = randomFloat(normalized, 30 + w, 0.04, 0.08)
        const phase = randomFloat(normalized, 40 + w, 0, Math.PI * 2)
        const yOffset = (size / (waves + 1)) * (w + 1)

        let path = `M 0 ${yOffset}`
        for (let x = 0; x <= size; x += 3) {
          const y = yOffset + Math.sin(x * freq + phase) * amp
          path += ` L ${x} ${y}`
        }

        const sw = randomFloat(normalized, 50 + w, 2, 4)
        const opacity = randomFloat(normalized, 60 + w, 0.7, 0.95)
        shapes += `<path d="${path}" fill="none" stroke="${w % 2 === 0 ? color1 : color2}" stroke-width="${sw}" opacity="${opacity}"/>`
      }
      break
    }

    case 4: {
      // Спираль
      const turns = randomFloat(normalized, 10, 2, 4)
      const points = 80
      let path = ''

      for (let i = 0; i < points; i++) {
        const t = i / points
        const angle = t * turns * Math.PI * 2
        const r = t * (size / 2 - 10)
        const x = center + Math.cos(angle) * r
        const y = center + Math.sin(angle) * r

        if (i === 0) {
          path = `M ${x} ${y}`
        } else {
          path += ` L ${x} ${y}`
        }
      }

      const sw = randomFloat(normalized, 20, 3, 6)
      shapes += `<path d="${path}" fill="none" stroke="${color1}" stroke-width="${sw}" opacity="0.9"/>`
      break
    }

    case 5: {
      // Мандала
      const petals = randomInt(normalized, 10, 8, 12)
      const rings = randomInt(normalized, 11, 2, 4)

      for (let ring = 0; ring < rings; ring++) {
        const r = (size / 2 - 10) * ((ring + 1) / rings) * 0.7

        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2
          const x1 = center + Math.cos(angle) * r * 0.4
          const y1 = center + Math.sin(angle) * r * 0.4
          const x2 = center + Math.cos(angle) * r
          const y2 = center + Math.sin(angle) * r

          const midAngle = angle + Math.PI / petals
          const cpX = center + Math.cos(midAngle) * r * 0.8
          const cpY = center + Math.sin(midAngle) * r * 0.8

          const path = `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`
          const sw = randomFloat(normalized, 30 + ring * petals + i, 1.5, 3)
          const opacity = randomFloat(normalized, 50 + ring * petals + i, 0.6, 0.9)

          shapes += `<path d="${path}" fill="none" stroke="${(ring + i) % 2 === 0 ? color1 : color2}" stroke-width="${sw}" opacity="${opacity}"/>`
        }
      }
      break
    }
  }

  // Фоновый градиент
  const bgOpacity = randomFloat(normalized, 2, 0.05, 0.15)

  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg-${simpleHash(normalized)}">
        <stop offset="0%" stop-color="${color1}" stop-opacity="${bgOpacity}"/>
        <stop offset="100%" stop-color="${color2}" stop-opacity="${bgOpacity}"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bg-${simpleHash(normalized)})"/>
    ${shapes}
  </svg>`

  // Используем encodeURIComponent вместо btoa для лучшей совместимости
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
