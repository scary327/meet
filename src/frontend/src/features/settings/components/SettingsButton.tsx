// import { useTranslation } from 'react-i18next'
import { DialogTrigger } from 'react-aria-components'
import { RiSettings3Line } from '@remixicon/react'
import { Button } from '@/primitives'
import { SettingsDialog } from './SettingsDialog'

export const SettingsButton = () => {
  // const { t } = useTranslation('settings')
  return (
    <DialogTrigger>
      <Button
        square
        size="sm"
        variant="primaryDark"
        aria-label="Настройки"
        tooltip="Настройки"
      >
        <RiSettings3Line />
      </Button>
      <SettingsDialog />
    </DialogTrigger>
  )
}
