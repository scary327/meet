import { TabPanel, TabPanelProps } from '@/primitives/Tabs'
import { Field, H } from '@/primitives'
import { css } from '@/styled-system/css'
import { useSnapshot } from 'valtio'
import { notificationsStore } from '@/stores/notifications'

export type NotificationsTabProps = Pick<TabPanelProps, 'id'>

export const NotificationsTab = ({ id }: NotificationsTabProps) => {
  const notificationsSnap = useSnapshot(notificationsStore)

  const notificationLabels: Record<string, string> = {
    participantJoined: 'Участник присоединился',
    handRaised: 'Поднята рука',
    messageReceived: 'Получено сообщение',
  }

  return (
    <TabPanel flex id={id}>
      <H lvl={2}>Звуковые уведомления</H>
      <ul
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        })}
      >
        {Array.from(notificationsSnap.soundNotifications).map(
          ([key, value]) => (
            <li key={key}>
              <Field
                type="switch"
                aria-label={`${value ? 'Отключить' : 'Включить'} звуковые уведомления для "${notificationLabels[key] || key}"`}
                label={notificationLabels[key] || key}
                isSelected={value}
                onChange={(v) => {
                  notificationsStore.soundNotifications.set(key, v)
                }}
                wrapperProps={{
                  noMargin: true,
                  fullWidth: true,
                }}
              />
            </li>
          )
        )}
      </ul>
    </TabPanel>
  )
}
