import {
  ToggleButton as RACToggleButton,
  ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components'
import { type ButtonRecipeProps, buttonRecipe } from './buttonRecipe'
import { TooltipWrapper, TooltipWrapperProps } from './TooltipWrapper'
import { ReactNode } from 'react'
import { css } from '@/styled-system/css'

export type ToggleButtonProps = RACToggleButtonProps &
  ButtonRecipeProps &
  TooltipWrapperProps & {
    // Use tooltip as description below the button.
    description?: boolean
    icon?: ReactNode
  }

/**
 * React aria ToggleButton with our button styles, that can take a tooltip if needed
 */
export const ToggleButton = ({
  tooltip,
  tooltipType,
  ...props
}: ToggleButtonProps) => {
  const [variantProps, componentProps] = buttonRecipe.splitVariantProps(props)

  const showDescription = props.description && tooltip

  const descriptionWrapperClass = css({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.75rem',
    alignItems: 'center',
  })

  return (
    <TooltipWrapper
      tooltip={showDescription ? undefined : tooltip}
      tooltipType={tooltipType}
    >
      <RACToggleButton
        {...componentProps}
        className={[
          buttonRecipe(variantProps),
          props.className,
          showDescription ? descriptionWrapperClass : '',
        ].join(' ')}
      >
        <>
          {!showDescription && (componentProps.children as ReactNode)}
          {!showDescription && props.icon}
          {showDescription && (
            <>
              <span>
                {props.icon || (componentProps.children as ReactNode)}
              </span>
              <span>{tooltip}</span>
            </>
          )}
        </>
      </RACToggleButton>
    </TooltipWrapper>
  )
}
