import { RiMoreFill } from '@remixicon/react'
import { Button, Menu } from '@/primitives'
import { OptionsMenuItems } from './OptionsMenuItems'

// Русские тексты для компонента
const texts = {
  moreOptions: 'Ещё опции',
}

export const OptionsButton = () => {
  return (
    <Menu variant="dark">
      <Button
        square
        variant="primaryDark"
        aria-label={texts.moreOptions}
        tooltip={texts.moreOptions}
      >
        <RiMoreFill />
      </Button>
      <OptionsMenuItems />
    </Menu>
  )
}
