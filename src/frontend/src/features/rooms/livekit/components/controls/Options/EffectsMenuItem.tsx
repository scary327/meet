import { RiImageCircleAiFill } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { menuRecipe } from '@/primitives/menuRecipe'
import { useSidePanel } from '../../../hooks/useSidePanel'

export const EffectsMenuItem = () => {
  const { toggleEffects } = useSidePanel()

  return (
    <MenuItem
      onAction={() => toggleEffects()}
      className={menuRecipe({ icon: true, variant: 'dark' }).item}
    >
      <RiImageCircleAiFill size={20} />
      Эффекты
    </MenuItem>
  )
}
