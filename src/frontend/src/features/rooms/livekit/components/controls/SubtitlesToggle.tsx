import { RiClosedCaptioningLine } from '@remixicon/react'
import { ToggleButton } from '@/primitives'
import { css } from '@/styled-system/css'
import { useSubtitles } from '@/features/subtitle/hooks/useSubtitles'
import { useAreSubtitlesAvailable } from '@/features/subtitle/hooks/useAreSubtitlesAvailable'

// Русские тексты для компонента
const texts = {
  subtitles: {
    closed: 'Показать субтитры',
    open: 'Скрыть субтитры',
  },
}

export const SubtitlesToggle = () => {
  const { areSubtitlesOpen, toggleSubtitles, areSubtitlesPending } =
    useSubtitles()
  const tooltipLabel = areSubtitlesOpen ? texts.subtitles.open : texts.subtitles.closed
  const areSubtitlesAvailable = useAreSubtitlesAvailable()

  if (!areSubtitlesAvailable) return null

  return (
    <div
      className={css({
        position: 'relative',
        display: 'inline-block',
      })}
    >
      <ToggleButton
        square
        variant="primaryDark"
        aria-label={tooltipLabel}
        tooltip={tooltipLabel}
        isSelected={areSubtitlesOpen}
        isDisabled={areSubtitlesPending}
        onPress={toggleSubtitles}
        data-attr={`controls-subtitles-${areSubtitlesOpen ? 'open' : 'closed'}`}
      >
        <RiClosedCaptioningLine />
      </ToggleButton>
    </div>
  )
}
