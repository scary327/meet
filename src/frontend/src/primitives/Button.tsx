import {
  Button as RACButton,
  type ButtonProps as RACButtonsProps,
} from 'react-aria-components'
import { type RecipeVariantProps, css } from '@/styled-system/css'
import { buttonRecipe, type ButtonRecipe } from './buttonRecipe'
import { TooltipWrapper, type TooltipWrapperProps } from './TooltipWrapper'
import { ReactNode } from 'react'
import { Loader } from './Loader'

export type ButtonProps = RecipeVariantProps<ButtonRecipe> &
  RACButtonsProps &
  TooltipWrapperProps & {
    // Use tooltip as description below the button.
    description?: boolean
  } & {
    icon?: ReactNode
  }

export const Button = ({
  tooltip,
  tooltipType = 'instant',
  ...props
}: ButtonProps) => {
  const [variantProps, componentProps] = buttonRecipe.splitVariantProps(props)
  const { className, ...remainingComponentProps } = componentProps

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
      <RACButton
        className={[
          buttonRecipe(variantProps),
          className,
          showDescription ? descriptionWrapperClass : '',
        ].join(' ')}
        {...(remainingComponentProps as RACButtonsProps)}
      >
        {!props.loading && !showDescription && props.icon}
        {!props.loading &&
          !showDescription &&
          (componentProps.children as ReactNode)}
        {props.loading && <Loader />}
        {showDescription && (
          <>
            <span>{props.icon}</span>
            <span>{tooltip}</span>
          </>
        )}
      </RACButton>
    </TooltipWrapper>
  )
}
