// import { useTranslation } from 'react-i18next'
import { Field, Ul, H, P, Form, Dialog } from '@/primitives'
import { navigateTo } from '@/navigation/navigateTo'
import { isRoomValid } from '@/features/rooms'

export const JoinMeetingDialog = () => {
  // const { t } = useTranslation('home')
  return (
    <Dialog title="Присоединиться к встрече">
      <Form
        onSubmit={(data) => {
          navigateTo(
            'room',
            (data.roomId as string)
              .trim()
              .replace(`${window.location.origin}/`, '')
          )
        }}
        submitLabel="Присоединиться к встрече"
      >
        <Field
          type="text"
          name="roomId"
          label="Ссылка на встречу"
          description={`URL или 10-буквенный код`}
          validate={(value) => {
            return !isRoomValid(value.trim()) ? (
              <>
                <p>Используйте ссылку или код встречи. Примеры:</p>
                <Ul>
                  <li>{window.location.origin}/uio-azer-jkl</li>
                  <li>uio-azer-jkl</li>
                </Ul>
              </>
            ) : null
          }}
        />
      </Form>
      <H lvl={2}>Знаете ли вы?</H>
      <P last>
        Вы можете присоединиться к встрече, вставив полную ссылку в адресную
        строку браузера.
      </P>
    </Dialog>
  )
}
