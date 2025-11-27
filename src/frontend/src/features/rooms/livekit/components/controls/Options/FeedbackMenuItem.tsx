import { RiMegaphoneLine } from '@remixicon/react'
import { MenuItem } from 'react-aria-components'
import { menuRecipe } from '@/primitives/menuRecipe'
import { useConfig } from '@/api/useConfig'

export const FeedbackMenuItem = () => {
  const { data } = useConfig()

  if (!data?.feedback?.url) return

  return (
    <MenuItem
      href={data?.feedback?.url}
      target="_blank"
      className={menuRecipe({ icon: true, variant: 'dark' }).item}
    >
      <RiMegaphoneLine size={20} />
      Фидбек
    </MenuItem>
  )
}
