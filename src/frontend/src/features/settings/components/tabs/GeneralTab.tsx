import { Field, H } from '@/primitives'
import { TabPanel, TabPanelProps } from '@/primitives/Tabs'
import { userPreferencesStore } from '@/stores/userPreferences'
import { useSnapshot } from 'valtio'

export type GeneralTabProps = Pick<TabPanelProps, 'id'>

export const GeneralTab = ({ id }: GeneralTabProps) => {
  const userPreferencesSnap = useSnapshot(userPreferencesStore)

  return (
    <TabPanel flex id={id}>
      <H lvl={2}>Параметры</H>
      <Field
        type="switch"
        label="Выходить из вызовов без участников"
        description="Автоматически выходит из вызова через несколько минут, если никто другой не присоединился"
        isSelected={userPreferencesSnap.is_idle_disconnect_modal_enabled}
        onChange={(value) =>
          (userPreferencesStore.is_idle_disconnect_modal_enabled = value)
        }
        wrapperProps={{
          noMargin: true,
          fullWidth: true,
        }}
      />
    </TabPanel>
  )
}
