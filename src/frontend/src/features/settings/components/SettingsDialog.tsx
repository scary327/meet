// import { Trans, useTranslation } from 'react-i18next'
// import { useLanguageLabels } from '@/i18n/useLanguageLabels'
import { A, Badge, Dialog, type DialogProps, H, P } from '@/primitives'
import { useUser } from '@/features/auth'
import { LoginButton } from '@/components/LoginButton'

export type SettingsDialogProps = Pick<DialogProps, 'isOpen' | 'onOpenChange'>

export const SettingsDialog = (props: SettingsDialogProps) => {
  // const { t, i18n } = useTranslation('settings')
  const { user, isLoggedIn, logout } = useUser()
  // const { languagesList, currentLanguage } = useLanguageLabels()
  const userDisplay =
    user?.full_name && user?.email
      ? `${user.full_name} (${user.email})`
      : user?.email
  return (
    <Dialog title="Настройки" {...props}>
      <H lvl={2}>Аккаунт</H>
      {isLoggedIn ? (
        <>
          <P>
            Вы вошли как <Badge>{userDisplay}</Badge>
          </P>
          <P>
            <A onPress={logout}>Выйти</A>
          </P>
        </>
      ) : (
        <>
          <P>Вы не авторизованы</P>
          <LoginButton />
        </>
      )}
      {/* <H lvl={2}>{t('language.heading')}</H>
      <Field
        type="select"
        label={t('language.label')}
        items={languagesList}
        defaultSelectedKey={currentLanguage.key}
        onSelectionChange={(lang) => {
          i18n.changeLanguage(lang as string)
        }}
      /> */}
    </Dialog>
  )
}
