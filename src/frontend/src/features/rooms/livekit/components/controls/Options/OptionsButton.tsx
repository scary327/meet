import { RiMoreFill } from '@remixicon/react'
import { Button, Menu } from '@/primitives'
import { OptionsMenuItems } from './OptionsMenuItems'

export const OptionsButton = () => {
  const text = 'Настройки'

  return (
    <Menu variant="dark">
      <Button
        square
        variant="primaryDark"
        aria-label={text}
        tooltip={text}
      >
        <RiMoreFill />
      </Button>
      <OptionsMenuItems />
    </Menu>
  )
}
