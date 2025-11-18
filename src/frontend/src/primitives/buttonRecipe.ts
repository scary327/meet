import { type RecipeVariantProps, cva } from '@/styled-system/css'

export const buttonRecipe = cva({
  base: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 200ms ease-in-out',
    cursor: 'pointer',
    border: '1px solid transparent',
    '&[data-disabled]': {
      cursor: 'default',
    },
    gap: '0.5rem',
  },
  variants: {
    size: {
      default: {
        borderRadius: 4,
        paddingX: '1',
        paddingY: '0.625',
        '--square-padding': '{spacing.0.625}',
      },
      sm: {
        borderRadius: 4,
        paddingX: '0.5',
        paddingY: '0.25',
        '--square-padding': '{spacing.0.25}',
      },
      xs: {
        borderRadius: 4,
        '--square-padding': '0',
      },
    },
    square: {
      true: {
        paddingX: 'var(--square-padding)',
        paddingY: 'var(--square-padding)',
      },
    },
    variant: {
      primary: {
        backgroundColor: 'primary.800',
        color: 'white',
        fontWeight: 'medium !important',
        '&[data-hovered]': {
          backgroundColor: 'primary.action',
        },
        '&[data-pressed]': {
          backgroundColor: 'primary.action',
        },
        '&[data-disabled]': {
          backgroundColor: 'greyscale.100',
          color: 'greyscale.400',
        },
      },
      secondary: {
        backgroundColor: 'white',
        color: 'primary.800',
        fontWeight: 'medium !important',
        borderColor: 'primary.800',
        '&[data-hovered]': {
          backgroundColor: 'greyscale.100',
        },
        '&[data-pressed]': {
          backgroundColor: 'greyscale.100',
        },
      },
      secondaryText: {
        backgroundColor: 'transparent',
        fontWeight: 'medium !important',
        color: 'primary.800',
        '&[data-hovered]': {
          backgroundColor: 'greyscale.100',
        },
        '&[data-pressed]': {
          backgroundColor: 'greyscale.100',
        },
        '&[data-disabled]': {
          color: 'greyscale.400',
        },
      },
      whiteCircle: {
        backgroundColor: '#ffffff',
        color: '#0e0b10',
        border: '1px solid #0e0b10',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        borderRadius: '50%',
        padding: '0',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: '#f5f5f5',
        },
        '&[data-pressed]': {
          backgroundColor: '#e8e8e8',
        },
        '&[data-selected=false]': {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            width: '85%',
            height: '3px',
            backgroundColor: '#ef413d',
            borderRadius: '2px',
          },
        },
      },
      bigSquare: {
        width: '56px',
        height: '56px',
        borderColor: 'greyscale.200',
        borderRadius: '4px',
        backgroundColor: 'greyscale.50',
        padding: '0',
        flexShrink: 0,
        '&[data-hovered]': {
          backgroundColor: 'greyscale.100',
        },
        transition: 'box-shadow 0.2s ease-in-out',
        '&[data-selected]': {
          boxShadow: 'token(colors.primary.400) 0px 0px 0px 3px inset',
        },
        '&[data-disabled]': {
          backgroundColor: 'greyscale.100',
          color: 'greyscale.400',
          opacity: '0.7',
        },
      },
      tertiary: {
        backgroundColor: 'primary.100',
        fontWeight: 'medium !important',
        color: 'primary.800',
        '&[data-hovered]': {
          backgroundColor: 'primary.300',
        },
        '&[data-pressed]': {
          backgroundColor: 'primary.300',
        },
        '&[data-disabled]': {
          backgroundColor: 'transparent',
          color: 'primary.400',
        },
      },
      tertiaryText: {
        backgroundColor: 'transparent',
        fontWeight: 'medium !important',
        color: 'primary.900',
        '&[data-hovered]': {
          backgroundColor: 'primary.300',
        },
        '&[data-pressed]': {
          backgroundColor: 'primary.300',
        },
      },
      primaryDark: {
        backgroundColor: '#ffffff',
        fontWeight: 'medium !important',
        color: '#0e0b10',
        border: '1px solid #0e0b10',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        padding: '0',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: '#f5f5f5',
        },
        '&[data-pressed]': {
          backgroundColor: '#e8e8e8',
        },
        '&[data-disabled]': {
          backgroundColor: '#f5f5f5',
          color: '#666666',
          opacity: '0.5',
        },
        '&[data-selected=false]': {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            width: '85%',
            height: '3px',
            backgroundColor: '#ef413d',
            borderRadius: '2px',
          },
        },
      },
      secondaryDark: {
        backgroundColor: '#ffffff',
        fontWeight: 'medium !important',
        color: '#0e0b10',
        border: '1px solid #0e0b10',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        padding: '0',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: '#f5f5f5',
        },
        '&[data-pressed]': {
          backgroundColor: '#e8e8e8',
        },
        '&[data-selected=false]': {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            width: '85%',
            height: '3px',
            backgroundColor: '#ef413d',
            borderRadius: '2px',
          },
        },
      },
      primaryTextDark: {
        backgroundColor: 'transparent',
        fontWeight: 'medium !important',
        color: '#0e0b10',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        padding: '0',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: '#f5f5f5',
        },
        '&[data-pressed]': {
          backgroundColor: '#e8e8e8',
        },
        '&[data-selected=false]': {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            width: '85%',
            height: '3px',
            backgroundColor: '#ef413d',
            borderRadius: '2px',
          },
        },
      },
      sidePanelButton: {
        backgroundColor: 'transparent',
        fontWeight: 'medium !important',
        color: '#ffffff',
        border: '1px solid transparent',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        padding: '0',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: '#ffffff',
          color: '#0e0b10',
          border: '1px solid #0e0b10',
        },
        '&[data-pressed]': {
          backgroundColor: '#e8e8e8',
          color: '#0e0b10',
          border: '1px solid #0e0b10',
        },
      },
      participantTileButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        fontWeight: 'medium !important',
        color: '#ffffff',
        border: '1px solid transparent',
        borderRadius: '8px',
        padding: '0.5rem',
        position: 'relative',
        '&[data-hovered]': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#0e0b10',
          border: '1px solid #ffffff',
        },
        '&[data-pressed]': {
          backgroundColor: '#ffffff',
          color: '#0e0b10',
          border: '1px solid #ffffff',
        },
        '&[data-disabled]': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.5)',
          opacity: '0.5',
        },
      },
      quaternaryText: {
        backgroundColor: 'transparent',
        fontWeight: 'medium !important',
        color: 'greyscale.600',
        '&[data-hovered]': {
          backgroundColor: 'greyscale.100',
          color: 'greyscale.700',
        },
        '&[data-pressed]': {
          backgroundColor: 'greyscale.100',
          color: 'greyscale.700',
        },
        '&[data-disabled]': {
          backgroundColor: 'transparent',
          color: 'greyscale.300',
        },
      },
      greyscale: {
        backgroundColor: 'transparent',
        color: 'greyscale.400',
        '&[data-hovered]': {
          color: 'greyscale.800',
        },
        '&[data-pressed]': {
          color: 'greyscale.800',
        },
        '&[data-selected]': {
          color: 'greyscale.800',
        },
        '&[data-disabled]': {
          color: 'greyscale.200',
        },
      },
      danger: {
        backgroundColor: 'error.400',
        color: 'white',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        minWidth: '56px',
        minHeight: '56px',
        padding: '0',
        '&[data-hovered]': {
          backgroundColor: 'error.600',
        },
        '&[data-pressed]': {
          backgroundColor: 'error.700',
          color: 'error.200',
        },
      },
      error2: {
        backgroundColor: 'error.200',
        color: 'error.900',
        '&[data-hovered]': {
          backgroundColor: 'error.300',
        },
        '&[data-focused]': {
          backgroundColor: 'error.200',
        },
        '&[data-pressed]': {
          backgroundColor: 'error.900',
          color: 'error.100',
        },
        '&[data-selected]': {
          backgroundColor: 'error.900 !important',
          color: 'error.100 !important',
        },
        '&[data-disabled]': {
          backgroundColor: 'error.200 !important',
          color: 'error.300 !important',
        },
      },
      errorCircle: {
        backgroundColor: 'error.500',
        width: '56px',
        height: '56px',
        borderRadius: '100%',
        color: 'white',
        '&[data-hovered]': {
          backgroundColor: 'error.600',
        },
        '&[data-pressed]': {
          backgroundColor: 'error.700',
          color: 'error.200',
        },
      },
      // @TODO: better handling of colors… this is a mess
      success: {
        colorPalette: 'success',
        color: 'success.subtle-text',
        backgroundColor: 'success.subtle',
        '&[data-hovered]': {
          backgroundColor: 'success.200',
        },
        '&[data-pressed]': {
          backgroundColor: 'success.subtle!',
        },
      },
      text: {
        color: 'primary',
        '&[data-hovered]': {
          background: 'gray.100 !important',
          color: 'primary !important',
        },
      },
      permission: {
        position: 'relative',
        borderRadius: '100%',
        color: 'amber.500',
        width: 'fit-content',
        height: 'fit-content',
        padding: '0 !important',
        margin: '0 !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    invisible: {
      true: {
        borderColor: 'none!',
        backgroundColor: 'none!',
        '&[data-hovered]': {
          backgroundColor: 'none!',
          borderColor: 'colorPalette.active!',
        },
        '&[data-pressed]': {
          borderColor: 'currentcolor',
        },
        '&[data-disabled]': {
          color: 'gray.300',
        },
      },
    },
    fullWidth: {
      true: {
        width: 'full',
      },
    },
    loading: {
      true: {},
    },
    // some toggle buttons make more sense without a "pushed button" style when selected because their content changes to mark the state
    shySelected: {
      true: {},
    },
    description: {
      true: {
        flexDirection: 'column',
        gap: '0.5rem',
        '& span': {
          fontSize: '13px',
          textAlign: 'center',
        },
      },
    },
    // if the button is next to other ones to make a "button group", tell where the button is to handle radius
    groupPosition: {
      left: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      right: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderLeft: 0,
      },
      center: {
        borderRadius: 0,
      },
    },
  },
  compoundVariants: [],
  defaultVariants: {
    size: 'default',
    variant: 'primary',
  },
})

export type ButtonRecipe = typeof buttonRecipe

export type ButtonRecipeProps = RecipeVariantProps<ButtonRecipe>
