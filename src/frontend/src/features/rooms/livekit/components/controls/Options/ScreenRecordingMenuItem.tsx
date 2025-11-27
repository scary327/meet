import { RiRecordCircleLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { menuRecipe } from '@/primitives/menuRecipe'
import { useSidePanel } from '@/features/rooms/livekit/hooks/useSidePanel'
import { RecordingMode, useHasRecordingAccess } from '@/features/recording'
import { FeatureFlags } from '@/features/analytics/enums'

export const ScreenRecordingMenuItem = () => {
  const { isScreenRecordingOpen, openScreenRecording, toggleTools } =
    useSidePanel()

  const hasScreenRecordingAccess = useHasRecordingAccess(
    RecordingMode.ScreenRecording,
    FeatureFlags.ScreenRecording
  )

  if (!hasScreenRecordingAccess) return null

  return (
    <MenuItem
      className={menuRecipe({ icon: true, variant: 'dark' }).item}
      onAction={() =>
        !isScreenRecordingOpen ? openScreenRecording() : toggleTools()
      }
    >
      <RiRecordCircleLine size={20} />
      Запись экрана
    </MenuItem>
  )
}
