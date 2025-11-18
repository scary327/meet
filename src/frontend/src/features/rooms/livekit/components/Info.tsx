// import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { VStack } from '@/styled-system/jsx'
import { css } from '@/styled-system/css'
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { Bold, Button, Div, Text } from '@/primitives'
import { getRouteUrl } from '@/navigation/getRouteUrl'
import { useRoomData } from '../hooks/useRoomData'
import { formatPinCode } from '../../utils/telephony'
import { useTelephony } from '../hooks/useTelephony'
import { useCopyRoomToClipboard } from '../hooks/useCopyRoomToClipboard'

export const Info = () => {
  // const { t } = useTranslation('rooms', { keyPrefix: 'info' })

  const data = useRoomData()
  const roomUrl = getRouteUrl('room', data?.slug)

  const telephony = useTelephony()

  const isTelephonyReadyForUse = useMemo(() => {
    return telephony?.enabled && data?.pin_code
  }, [telephony?.enabled, data?.pin_code])

  const { isCopied, copyRoomToClipboard } = useCopyRoomToClipboard(data)

  return (
    <Div
      display="flex"
      overflowY="scroll"
      padding="0 1.5rem"
      flexGrow={1}
      flexDirection="column"
      alignItems="start"
    >
      <VStack alignItems="start">
        <Text
          as="h3"
          className={css({
            display: 'flex',
            alignItems: 'center',
          })}
        >
          Информация о подключении
        </Text>
        <div
          className={css({
            gap: '0.15rem',
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <Text as="p" variant="xsNote" wrap="pretty">
            {roomUrl.replace(/^https?:\/\//, '')}
          </Text>
          {isTelephonyReadyForUse && (
            <>
              <Text as="p" variant="xsNote" wrap="pretty">
                <Bold>Звонить:</Bold> ({telephony?.country}){' '}
                {telephony?.internationalPhoneNumber}
              </Text>
              <Text as="p" variant="xsNote" wrap="pretty">
                <Bold>Код:</Bold> {formatPinCode(data?.pin_code)}
              </Text>
            </>
          )}
        </div>
        <Button
          size="sm"
          variant={isCopied ? 'success' : 'tertiaryText'}
          aria-label="Скопировать информацию из вашей встречи"
          onPress={copyRoomToClipboard}
          data-attr="copy-info-sidepannel"
          style={{
            marginLeft: '-8px',
          }}
        >
          {isCopied ? (
            <>
              <RiCheckLine size={24} style={{ marginRight: '6px' }} />
              Информация скопирована
            </>
          ) : (
            <>
              <RiFileCopyLine size={24} style={{ marginRight: '6px' }} />
              Скопировать информацию
            </>
          )}
        </Button>
      </VStack>
    </Div>
  )
}
