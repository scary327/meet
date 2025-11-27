import { RiFullscreenExitLine, RiFullscreenLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { useTranslation } from 'react-i18next'
import { menuRecipe } from '@/primitives/menuRecipe'
import { useFullScreen } from '../../../hooks/useFullScreen'

export const FullScreenMenuItem = () => {
  const { t } = useTranslation('rooms', { keyPrefix: 'options.items' })
  const { toggleFullScreen, isCurrentlyFullscreen, isFullscreenAvailable } =
    useFullScreen({})

  if (!isFullscreenAvailable) {
    return null
  }

  return (
    <MenuItem
      onAction={() => toggleFullScreen()}
      className={menuRecipe({ icon: true, variant: 'dark' }).item}
    >
      {isCurrentlyFullscreen ? (
        <>
          <RiFullscreenExitLine size={20} />
            Выйти из полноэкранного режима
        </>
      ) : (
        <>
          <RiFullscreenLine size={20} />
           Полный экран
        </>
      )}
    </MenuItem>
  )
}
