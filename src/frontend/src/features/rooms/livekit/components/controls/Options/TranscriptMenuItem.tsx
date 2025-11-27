import { RiFileTextLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { menuRecipe } from '@/primitives/menuRecipe'
import { useSidePanel } from '@/features/rooms/livekit/hooks/useSidePanel'
import { RecordingMode, useHasRecordingAccess } from '@/features/recording'
import { FeatureFlags } from '@/features/analytics/enums'

export const TranscriptMenuItem = () => {
  const { isTranscriptOpen, openTranscript, toggleTools } = useSidePanel()

  const hasTranscriptAccess = useHasRecordingAccess(
    RecordingMode.Transcript,
    FeatureFlags.Transcript
  )

  if (!hasTranscriptAccess) return null

  return (
    <MenuItem
      className={menuRecipe({ icon: true, variant: 'dark' }).item}
      onAction={() => (!isTranscriptOpen ? openTranscript() : toggleTools())}
    >
      <RiFileTextLine size={20} />
      Транскрипция
    </MenuItem>
  )
}
