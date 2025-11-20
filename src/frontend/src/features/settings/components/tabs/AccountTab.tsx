import { A, Badge, Button, DialogProps, Field, H, P } from '@/primitives'
import { Trans } from 'react-i18next'
import { useRoomContext } from '@livekit/components-react'
import { useUser } from '@/features/auth'
import { css } from '@/styled-system/css'
import { TabPanel, TabPanelProps } from '@/primitives/Tabs'
import { HStack } from '@/styled-system/jsx'
import { useState } from 'react'
import { LoginButton } from '@/components/LoginButton'
import { usePersistentUserChoices } from '@/features/rooms/livekit/hooks/usePersistentUserChoices'

export type AccountTabProps = Pick<DialogProps, 'onOpenChange'> &
  Pick<TabPanelProps, 'id'>

export const AccountTab = ({ id, onOpenChange }: AccountTabProps) => {
  const { saveUsername } = usePersistentUserChoices()
  const room = useRoomContext()
  const { user, isLoggedIn, logout } = useUser()
  const [name, setName] = useState(room?.localParticipant.name ?? '')
  const userDisplay =
    user?.full_name && user?.email
      ? `${user.full_name} (${user.email})`
      : user?.email

  const handleOnSubmit = () => {
    if (room) room.localParticipant.setName(name)
    saveUsername(name)
    if (onOpenChange) onOpenChange(false)
  }
  const handleOnCancel = () => {
    if (onOpenChange) onOpenChange(false)
  }

  return (
    <TabPanel flex id={id}>
      <H lvl={2}>Профиль</H>
      <Field
        type="text"
        label="Ваше имя"
        value={name}
        onChange={setName}
        validate={(value) => {
          return !value ? <p>Имя не может быть пустым</p> : null
        }}
      />
      <H lvl={2}>Аутентификация</H>
      {isLoggedIn ? (
        <>
          <P>
            <Trans
              i18nKey="settings:account.currentlyLoggedAs"
              values={{ user: userDisplay }}
              components={[<Badge />]}
            />
          </P>
          <P>
            <A onPress={logout}>Выход</A>
          </P>
        </>
      ) : (
        <>
          <P>Вы не авторизованы.</P>
          <LoginButton />
        </>
      )}
      <HStack
        className={css({
          marginTop: 'auto',
          marginLeft: 'auto',
        })}
      >
        <Button variant="secondary" onPress={handleOnCancel}>
          Отмена
        </Button>
        <Button variant={'primary'} onPress={handleOnSubmit}>
          ОК
        </Button>
      </HStack>
    </TabPanel>
  )
}
