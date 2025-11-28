import { Link, LinkProps } from 'react-aria-components'
import { type RecipeVariantProps, css } from '@/styled-system/css'
import { buttonRecipe, type ButtonRecipe } from './buttonRecipe'
import { TooltipWrapper, type TooltipWrapperProps } from './TooltipWrapper'
import { ReactNode } from 'react'

type LinkButtonProps = RecipeVariantProps<ButtonRecipe> &
  LinkProps &
  TooltipWrapperProps & {
    // Use tooltip as description below the button.
    description?: boolean
    target?: string
    icon?: ReactNode
  }

export const LinkButton = ({
  tooltip,
  tooltipType = 'instant',
  ...props
}: LinkButtonProps) => {
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
      <Link
        className={[
          buttonRecipe(variantProps),
          showDescription ? descriptionWrapperClass : '',
        ].join(' ')}
        {...componentProps}
      >
        <>
          {!showDescription && (
            <>
              {props.icon}
              {componentProps.children as ReactNode}
            </>
          )}
          {showDescription && (
            <>
              <span>{props.icon}</span>
              <span>{tooltip}</span>
            </>
          )}
        </>
      </Link>
    </TooltipWrapper>
  )
}
