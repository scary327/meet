import { useTranslation } from 'react-i18next'
import { DialogTrigger } from 'react-aria-components'
import { Button } from '@/primitives'
import { css } from '@/styled-system/css'
import { navigateTo } from '@/navigation/navigateTo'
import { Screen } from '@/layout/Screen'
import { generateRoomId, useCreateRoom } from '@/features/rooms'
import { useUser } from '@/features/auth'
import { usePersistentUserChoices } from '@/features/rooms/livekit/hooks/usePersistentUserChoices'
import { Logo } from '@/components/Logo'
import { CreateName } from '../components/CreateName'
import purpleCurve from '@/assets/purpleCurve.svg'
import { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { z } from 'zod'
import { JoinMeetingDialog } from '../components/JoinMeetingDialog'

const nameSchema = z
  .string()
  .refine((s) => (s ?? '').toString().trim().length > 0, {
    message: 'Введите имя',
  })

export const Home = () => {
  const { t } = useTranslation('home')
  const { isLoggedIn } = useUser()

  const {
    userChoices: { username },
    saveUsername,
  } = usePersistentUserChoices()

  const { mutateAsync: createRoom } = useCreateRoom()
  const [name, setName] = useState(username || '')
  const saveTimeoutRef = useRef<number | null>(null)

  const parsed = nameSchema.safeParse(name)
  const isValid = useMemo(() => parsed.success, [parsed])
  const errorMessage =
    !isValid && name !== ''
      ? (parsed.error?.issues?.[0]?.message ?? null)
      : null

  const handleNameChange = useCallback(
    (newName: string) => {
      setName(newName)

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveUsername(newName)
      }, 500) as unknown as number
    },
    [saveUsername]
  )

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const onSubmit = async () => {
    if (isValid) {
      const slug = generateRoomId()
      createRoom({ slug, username: name }).then((data) =>
        navigateTo('room', data.slug, {
          state: { create: true, initialRoomData: data },
        })
      )
    }
  }

  return (
    <Screen>
      {/* Logo in top left corner */}
      <Logo />

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '80px',
          padding: '2rem',
        })}
      >
        <CreateName
          value={name}
          onChange={handleNameChange}
          error={errorMessage}
        />

        <div
          className={css({
            position: 'relative',
            width: '286px',
            height: '235px',
            marginTop: '60px',
            transform: 'rotate(0deg)',
            transition: 'transform 300ms ease-in-out',
            '& img': {
              transition: 'transform 400ms ease-in-out',
            },
            _hover: {
              // transform: 'rotate(75deg)',
              '& img': {
                transform: 'scale(1.05)',
              },
            },
          })}
        >
          <img
            src={purpleCurve}
            alt="decorative curve"
            className={css({
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            })}
          />

          <div
            className={css({
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            })}
          >
            <Button
              variant="primary"
              onPress={onSubmit}
              isDisabled={!isValid}
              className={css({
                fontWeight: 'extrabold',
                fontSize: '24px',
                backgroundColor: 'black',
                color: 'white',
                _hover: {
                  backgroundColor: '#1a1a1a',
                },
              })}
            >
              {t('createMeeting')}
            </Button>
          </div>
        </div>

        {/* Join meeting button */}
        {isLoggedIn && (
          <div
            className={css({
              marginTop: '2rem',
            })}
          >
            <DialogTrigger>
              <Button variant="secondary">{t('joinMeeting')}</Button>
              <JoinMeetingDialog />
            </DialogTrigger>
          </div>
        )}
      </div>
    </Screen>
  )
}
