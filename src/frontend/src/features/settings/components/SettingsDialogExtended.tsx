import { Dialog, type DialogProps } from '@/primitives'
import { Tab, Tabs, TabList } from '@/primitives/Tabs.tsx'
import { css } from '@/styled-system/css'
import { text } from '@/primitives/Text.tsx'
import { Heading } from 'react-aria-components'
import {
  RiAccountCircleLine,
  RiNotification3Line,
  RiSettings3Line,
  RiSpeakerLine,
  RiVideoOnLine,
} from '@remixicon/react'
import { AccountTab } from './tabs/AccountTab'
import { NotificationsTab } from './tabs/NotificationsTab'
import { GeneralTab } from './tabs/GeneralTab'
import { AudioTab } from './tabs/AudioTab'
import { VideoTab } from './tabs/VideoTab'
import { useRef } from 'react'
import { useMediaQuery } from '@/features/rooms/livekit/hooks/useMediaQuery'
import { SettingsDialogExtendedKey } from '@/features/settings/type'

const tabsStyle = css({
  maxHeight: '40.625rem',
  width: '50rem',
  marginY: '-1rem',
  maxWidth: '100%',
  overflow: 'hidden',
  height: 'calc(100vh - 2rem)',
})

const tabsStyleMobile = css({
  maxHeight: '40.625rem',
  width: '100%',
  marginY: '-1rem',
  maxWidth: '100%',
  overflow: 'hidden',
  height: 'auto',
  flexDirection: 'column',
  paddingX: '1rem',
})

const tabListContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid lightGray',
  paddingY: '1rem',
  paddingRight: '1.5rem',
})

const tabListContainerMobileStyle = css({
  display: 'flex',
  flexDirection: 'row',
  borderRight: 'none',
  borderBottom: 'none',
  paddingY: '1rem',
  paddingRight: '0',
  paddingX: '0',
  overflowX: 'auto',
  gap: '0.5rem',
  marginX: '-1rem',
  width: 'calc(100% + 2rem)',
})

const tabPanelContainerStyle = css({
  display: 'flex',
  flexGrow: '1',
  marginTop: '3.5rem',
  minWidth: 0,
})

const tabPanelContainerMobileStyle = css({
  display: 'flex',
  flexGrow: '1',
  marginTop: '1rem',
  minWidth: 0,
})

export type SettingsDialogExtended = Pick<
  DialogProps,
  'isOpen' | 'onOpenChange'
> & {
  defaultSelectedTab?: SettingsDialogExtendedKey
}

const tabNames: Record<SettingsDialogExtendedKey, string> = {
  account: 'Профиль',
  audio: 'Аудио',
  video: 'Видео',
  general: 'Основные',
  notifications: 'Уведомления',
}

export const SettingsDialogExtended = (props: SettingsDialogExtended) => {
  const dialogEl = useRef<HTMLDivElement>(null)
  const isWideScreen = useMediaQuery('(min-width: 800px)') // fixme - hardcoded 50rem in pixel
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Dialog innerRef={dialogEl} {...props} role="dialog" type="flex">
      <Tabs
        orientation={isMobile ? 'horizontal' : 'vertical'}
        className={isMobile ? tabsStyleMobile : tabsStyle}
        defaultSelectedKey={props.defaultSelectedTab}
      >
        <div
          className={isMobile ? tabListContainerMobileStyle : tabListContainerStyle}
          style={{
            flex: isWideScreen && !isMobile ? '0 0 16rem' : undefined,
            paddingTop: !isWideScreen && !isMobile ? '64px' : undefined,
            paddingRight: !isWideScreen && !isMobile ? '1rem' : undefined,
          }}
        >
          {isWideScreen && !isMobile && (
            <Heading slot="title" level={1} className={text({ variant: 'h1' })}>
              Параметры
            </Heading>
          )}
          <TabList border={false}>
            <Tab icon highlight id={SettingsDialogExtendedKey.ACCOUNT}>
              <RiAccountCircleLine />
              {isWideScreen && !isMobile && tabNames[SettingsDialogExtendedKey.ACCOUNT]}
            </Tab>
            <Tab icon highlight id={SettingsDialogExtendedKey.AUDIO}>
              <RiSpeakerLine />
              {isWideScreen && !isMobile && tabNames[SettingsDialogExtendedKey.AUDIO]}
            </Tab>
            <Tab icon highlight id={SettingsDialogExtendedKey.VIDEO}>
              <RiVideoOnLine />
              {isWideScreen && !isMobile && tabNames[SettingsDialogExtendedKey.VIDEO]}
            </Tab>
            <Tab icon highlight id={SettingsDialogExtendedKey.GENERAL}>
              <RiSettings3Line />
              {isWideScreen && !isMobile && tabNames[SettingsDialogExtendedKey.GENERAL]}
            </Tab>
            <Tab icon highlight id={SettingsDialogExtendedKey.NOTIFICATIONS}>
              <RiNotification3Line />
              {isWideScreen && !isMobile && tabNames[SettingsDialogExtendedKey.NOTIFICATIONS]}
            </Tab>
          </TabList>
        </div>
        <div className={isMobile ? tabPanelContainerMobileStyle : tabPanelContainerStyle}>
          <AccountTab
            id={SettingsDialogExtendedKey.ACCOUNT}
            onOpenChange={props.onOpenChange}
          />
          <AudioTab id={SettingsDialogExtendedKey.AUDIO} />
          <VideoTab id={SettingsDialogExtendedKey.VIDEO} />
          <GeneralTab id={SettingsDialogExtendedKey.GENERAL} />
          <NotificationsTab id={SettingsDialogExtendedKey.NOTIFICATIONS} />
        </div>
      </Tabs>
    </Dialog>
  )
}
