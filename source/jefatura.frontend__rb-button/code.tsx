import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface IRbButton {
  /**
   * Establece el atributo data-qa-id para el componente
   */
  dataQaId?: string;

  /**
   * Establece el estilo de visualización del botón
   */
  styleBtn?: 'fill' | 'stroke' | 'text';

  /**
   * Establece el estilo de visualización del botón
   */
  typeBtn?: 'primary' | 'secondary' | 'tertiary' | 'error';

  /**
   * Establece el texto que se debe mostrar en el botón
   */
  label?: string;

  /**
   * Establece el atributo [type] del botón. Por defecto: button
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Establece si el botón debe mostrarse en el estado cargando
   */
  loading?: boolean;

  /**
   * Establece si se desea mostrar una animación mientras el botón esta en estado cargando
   */
  loadingAnimation?: boolean;

  /**
   * Establece el icono que se desea tener cuando el botón esta en estado cargando
   */
  iconLoading?: string;

  /**
   * Establece si el botón debe estar deshabilitado
   */
  disabled?: boolean;

  /**
   * Establece el icono que debe tener el botón
   */
  icon?: string;

  /**
   * Establece la posición del icono en el botón
   */
  iconPosition?: 'left' | 'right';

  /**
   * Establece las clases que se desean agregar al botón, deben estar separadas por un espacio
   */
  className?: string;

  /**
   * Establece los estilos que se deben aplicar al botón
   */
  style?: React.CSSProperties;

  /**
   * Establece el atributo name que tendrá el elemento button del componente
   */
  name?: string;

  /**
   * Establece el atributo tabIndex para el botón
   */
  tabIndex?: number;

  /**
   * Ejecuta una función cuando se hace clic en el botón
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Ejecuta una función cuando se presiona una tecla
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

interface ButtonProps {
  custom?: IRbButton;
}

export const RbButton: React.FC<ButtonProps> = ({ custom = {} }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Set tabindex after component mounts (similar to ngAfterViewInit)
  useEffect(() => {
    if (buttonRef.current && (custom.tabIndex || custom.tabIndex === 0)) {
      buttonRef.current.setAttribute('tabindex', custom.tabIndex.toString());
    }
  }, [custom.tabIndex]);

  // Generate CSS classes (equivalent to setClass() method)
  const getButtonClasses = (): string => {
    let classCSS = `rb-button__${custom.styleBtn ?? 'fill'}`;
    classCSS += ` rb-button__${custom.typeBtn ?? 'primary'}`;
    
    if (custom.loadingAnimation) classCSS += ' rb-button__animation';
    if (custom.loading) classCSS += ' rb-button__loading';
    if (custom.disabled) classCSS += ' rb-button__disabled';
    // Add only-icon class if no label and either has icon or is loading
    if (!custom.label && (custom.icon || custom.loading)) classCSS += ' rb-button__only-icon';
    
    return classCSS;
  };

  // Handle icon rendering - priority: loading icon > regular icon
  const renderIcon = (position: 'left' | 'right') => {
    // If loading, show loading icon in the specified iconPosition (default: left)
    if (custom.loading) {
      const loadingPosition = custom.iconPosition || 'left';
      if (position === loadingPosition) {
        return (
          <i 
            className={cn(
              'rb-button__icon',
              `rb-button__icon--${loadingPosition}`,
              custom.iconLoading || 'fas fa-circle-notch fa-spin'
            )}
          />
        );
      }
      // If loading but wrong position, don't show anything
      return null;
    }

    // Regular icon logic when not loading
    if (!custom.icon || (custom.iconPosition && custom.iconPosition !== position)) {
      return null;
    }

    return (
      <i 
        className={cn(
          'rb-button__icon',
          `rb-button__icon--${position}`,
          custom.icon
        )}
      />
    );
  };

  return (
    <div>
    <style>
        {`
          /* Button CSS Variables */
          .rb-button,
          .rb-button__element {
            /* General */
            --rb-btn-font-family: var(--c-rb-btn-font-family, var(--c-rb-font-family, 'Roboto', sans-serif));
            --rb-btn-font-size: var(--c-rb-btn-font-size, var(--c-rb-fontsizeButton, 1rem));
            --rb-btn-font-size-icon: var(--c-rb-btn-font-size-icon, 1.125rem);
            --rb-btn-text-decoration: var(--c-rb-btn-text-decoration, none);
            --rb-btn-border-radius: var(--c-rb-btn-border-radius, 3.125rem);
            --rb-btn-min-width: var(--c-rb-btn-min-width, 6rem);
            --rb-btn-height: var(--c-rb-btn-height, 2.5rem);
            --rb-btn-padding: var(--c-rb-btn-padding, 0.5rem 1rem);

            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-primaryBase, #48555b));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-width: var(--c-rb-btn-border-width, 1px);
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-primaryBase, #48555b));
            --rb-btn-box-shadow: var(--c-rb-btn-box-shadow, none);

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-primaryD100, #3b4448));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-width-hover: var(--c-rb-btn-border-width-hover, 1px);
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-primaryD100, #3b4448));
            --rb-btn-box-shadow-hover: var(--c-rb-btn-box-shadow-hover, none);

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-primaryD200, #32383b));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-width-pressed: var(--c-rb-btn-border-width-pressed, 1px);
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-primaryD200, #32383b));
            --rb-btn-box-shadow-pressed: var(--c-rb-btn-box-shadow-pressed, inset 2px 2px 3px rgba(27, 27, 27, 0.16));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-width-focus: var(--c-rb-btn-border-width-focus, 1px);
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-primaryL100, #7f888c));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-width-disabled: var(--c-rb-btn-border-width-disabled, 1px);
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-box-shadow-disabled: var(--c-rb-btn-box-shadow-disabled, none);

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-primaryL300, #c8ccce));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-width-disabled-hover: var(--c-rb-btn-border-width-disabled-hover, 1px);
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-primaryL300, #c8ccce));
            --rb-btn-box-shadow-disabled-hover: var(--c-rb-btn-box-shadow-disabled-hover, none);

            /* Loading */
            --rb-btn-bg-loading-animation: var(--c-rb-btn-bg-loading-animation, var(--c-rb-primaryD400, #202121));
            --rb-btn-loading-animation-duration: var(--c-rb-btn-loading-animation-duration, 1.5s);
            --rb-btn-bg-loading-animation-disabled: var(--c-rb-btn-bg-loading-animation-disabled, var(--c-rb-grayscaleBase, #9b9b9b));
          }

          .rb-button {
            display: inline-flex;
          }

          .rb-button:not(.rb-button__only-icon) {
            min-width: var(--rb-btn-min-width);
          }

          .rb-button__element {
            width: 100%;
            font-family: var(--rb-btn-font-family);
            font-size: var(--rb-btn-font-size);
            justify-content: center;
            align-items: center;
            border-radius: var(--rb-btn-border-radius);
            transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
            border-style: solid;
            border-width: var(--rb-btn-border-width);
            border-color: var(--rb-btn-border-color);
            background: var(--rb-btn-bg);
            color: var(--rb-btn-color);
            box-shadow: var(--rb-btn-box-shadow);
            display: inline-flex;
            cursor: pointer;
            text-decoration: var(--rb-btn-text-decoration);
            outline: none;
            position: relative;
            padding: var(--rb-btn-padding);
            height: var(--rb-btn-height);
            min-width: var(--rb-btn-min-width);
          }

          .rb-button__element:hover:not(:disabled) {
            background: var(--rb-btn-bg-hover) !important;
            color: var(--rb-btn-color-hover) !important;
            border-color: var(--rb-btn-border-color-hover) !important;
            border-width: var(--rb-btn-border-width-hover) !important;
            box-shadow: var(--rb-btn-box-shadow-hover) !important;
          }

          .rb-button__element:active:not(:disabled) {
            background: var(--rb-btn-bg-pressed) !important;
            color: var(--rb-btn-color-pressed) !important;
            border-color: var(--rb-btn-border-color-pressed) !important;
            border-width: var(--rb-btn-border-width-pressed) !important;
            box-shadow: var(--rb-btn-box-shadow-pressed) !important;
          }

          /* Focus visible solo para navegación por teclado (accesibilidad) */
          .rb-button__element:focus-visible:not(:active):not(:disabled) {
            background: var(--rb-btn-bg-focus) !important;
            color: var(--rb-btn-color-focus) !important;
            border-color: var(--rb-btn-border-color-focus) !important;
            border-width: var(--rb-btn-border-width-focus) !important;
            box-shadow: var(--rb-btn-box-shadow-focus) !important;
          }

          /* NO mostrar focus en clics de mouse */
          .rb-button__element:focus:not(:focus-visible) {
            outline: none;
          }

          .rb-button__element:disabled,
          .rb-button__disabled .rb-button__element {
            cursor: default;
            background: var(--rb-btn-bg-disabled) !important;
            color: var(--rb-btn-color-disabled) !important;
            border-color: var(--rb-btn-border-color-disabled) !important;
            border-width: var(--rb-btn-border-width-disabled) !important;
            box-shadow: var(--rb-btn-box-shadow-disabled) !important;
          }

          .rb-button__element:disabled:hover,
          .rb-button__disabled .rb-button__element:hover {
            background: var(--rb-btn-bg-disabled-hover) !important;
            color: var(--rb-btn-color-disabled-hover) !important;
            border-color: var(--rb-btn-border-color-disabled-hover) !important;
            border-width: var(--rb-btn-border-width-disabled-hover) !important;
            box-shadow: var(--rb-btn-box-shadow-disabled-hover) !important;
          }

          .rb-button__icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 1.333333333333em;
            height: 1.333333333333em;
            line-height: 1em;
            font-size: var(--rb-btn-font-size-icon);
            flex-shrink: 0;
          }

          /* Específicamente para Font Awesome - asegurar alineación perfecta */
          .rb-button__icon.fa,
          .rb-button__icon.fas,
          .rb-button__icon.far,
          .rb-button__icon.fal,
          .rb-button__icon.fab {
            line-height: 1;
            vertical-align: baseline;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Resetear pseudoelementos de Font Awesome que puedan interferir */
          .rb-button__icon.fa::before,
          .rb-button__icon.fas::before,
          .rb-button__icon.far::before,
          .rb-button__icon.fal::before,
          .rb-button__icon.fab::before {
            line-height: inherit;
            vertical-align: baseline;
          }

          .rb-button__icon--left {
            margin-right: 0.5rem;
          }

          .rb-button__icon--right {
            margin-left: 0.5rem;
          }

          .rb-button__only-icon .rb-button__element {
            min-width: unset !important;
            padding: 0;
            width: var(--rb-btn-height);
            height: var(--rb-btn-height);
            border-radius: var(--rb-btn-border-radius);
          }

          .rb-button__only-icon .rb-button__icon--left,
          .rb-button__only-icon .rb-button__icon--right {
            margin: 0;
          }

          /* Button label */
          .rb-button__label {
            font-family: var(--rb-btn-font-family);
            font-size: var(--rb-btn-font-size);
            text-decoration: var(--rb-btn-text-decoration);
            font-weight: 700;
            line-height: 140%;
            flex: unset;
          }

          /* Loading state */
          .rb-button__loading .rb-button__element {
            pointer-events: none;
          }

          /* Animación del gradiente de izquierda a derecha */
          @keyframes moverGradiente {
            0% {
              left: -110%; /* Empieza fuera a la izquierda */
            }
            100% {
              left: 0%; /* Llega a la derecha completamente */
            }
          }

          .rb-button__animation .rb-button__element {
            position: relative;
            z-index: 1;
            overflow: hidden; /* Evita que la animación se desborde del botón */
          }

          .rb-button__animation .rb-button__element::before {
            content: '';
            position: absolute;
            top: 0;
            left: -110%;
            width: 110%;
            height: 100%;
            transition: all 1s ease;
            z-index: 0;
          }

          .rb-button__animation .rb-button__label {
            z-index: 1;
            position: relative;
          }

          .rb-button__loading.rb-button__animation .rb-button__element::before {
            animation: moverGradiente linear infinite;
          }

          /* STROKE VARIANT */
          .rb-button__stroke .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-primaryBase, #48555b));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-primaryD100, #3b4448));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-primaryD100, #3b4448));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-primaryL300, #c8ccce));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-primaryD200, #32383b));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-primaryD200, #32383b));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-primaryBase, #48555b));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-primaryL200, #a4aaad));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-primaryL200, #a4aaad));
          }

          /* TEXT VARIANT */
          .rb-button__text .rb-button__element {
            --rb-btn-text-decoration: var(--c-rb-btn-text-decoration, underline);

            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, transparent);
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color: var(--c-rb-btn-border-color, transparent);

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-primaryD100, #3b4448));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-primaryL400, #edeeef));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-primaryL300, #c8ccce));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-primaryD200, #32383b));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-primaryL300, #c8ccce));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, transparent);
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, transparent);

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, transparent);
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, transparent);

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-primaryL400, #edeeef));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-primaryL100, #7f888c));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-primaryL400, #edeeef));
          }

          /* SECONDARY VARIANT */
          .rb-button__secondary .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-secondaryBase, #afc4cc));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-secondaryD100, #9cb6c0));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-secondaryD100, #9cb6c0));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-secondaryD200, #90adb8));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-secondaryD200, #90adb8));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-secondaryL100, #c7d6db));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-secondaryL400, #f7f9fa));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-secondaryL400, #f7f9fa));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-secondaryL300, #e7edf0));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-secondaryL300, #e7edf0));
          }

          .rb-button__secondary.rb-button__stroke .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-secondaryBase, #afc4cc));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-secondaryL400, #f7f9fa));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-secondaryD100, #9cb6c0));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-secondaryD100, #9cb6c0));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-secondaryL300, #e7edf0));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-secondaryD200, #90adb8));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-secondaryD200, #90adb8));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-secondaryL100, #c7d6db));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-secondaryL300, #e7edf0));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-secondaryL400, #f7f9fa));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-secondaryL400, #f7f9fa));
          }

          .rb-button__secondary.rb-button__text .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, transparent);
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-color: var(--c-rb-btn-border-color, transparent);

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-secondaryL400, #f7f9fa));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-secondaryD100, #9cb6c0));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-secondaryL400, #f7f9fa));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-secondaryL300, #e7edf0));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-secondaryD200, #90adb8));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-secondaryL300, #e7edf0));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, transparent);
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-secondaryBase, #afc4cc));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, transparent);
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-secondaryL100, #c7d6db));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, transparent);
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, transparent);

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-secondaryL400, #f7f9fa));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-secondaryL100, #c7d6db));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-secondaryL400, #f7f9fa));
          }

          /* TERTIARY VARIANT */
          .rb-button__tertiary .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-tertiaryBase, #bec0c6));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-tertiaryD100, #afb1b9));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-tertiaryD100, #afb1b9));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-tertiaryD200, #a5a7b0));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-tertiaryD200, #a5a7b0));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-primaryBase, #48555b));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-tertiaryL100, #d2d3d7));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-tertiaryL400, #f8f9f9));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-tertiaryL100, #d2d3d7));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-tertiaryL400, #f8f9f9));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-tertiaryL300, #ececee));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-tertiaryL100, #d2d3d7));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-tertiaryL300, #ececee));
          }

          .rb-button__tertiary.rb-button__stroke .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-tertiaryBase, #bec0c6));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-tertiaryL400, #f8f9f9));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-tertiaryD100, #afb1b9));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-tertiaryD100, #afb1b9));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-tertiaryL300, #ececee));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-tertiaryD200, #a5a7b0));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-tertiaryD200, #a5a7b0));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-tertiaryL100, #d2d3d7));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-tertiaryL100, #d2d3d7));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-tertiaryL200, #dfe0e3));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-tertiaryL400, #f8f9f9));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-tertiaryL200, #dfe0e3));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-tertiaryL200, #dfe0e3));
          }

          .rb-button__tertiary.rb-button__text .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, transparent);
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-border-color: var(--c-rb-btn-border-color, transparent);

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, transparent);
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-tertiaryD100, #afb1b9));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, transparent);

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, transparent);
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-tertiaryD200, #a5a7b0));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, transparent);

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, transparent);
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-tertiaryBase, #bec0c6));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, transparent);
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-tertiaryL100, #d2d3d7));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, transparent);
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-tertiaryL100, #d2d3d7));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, transparent);

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, transparent);
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-tertiaryL200, #dfe0e3));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, transparent);
          }

          /* ERROR VARIANT */
          .rb-button__error .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-errorBase, #dc3545));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-errorBase, #dc3545));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-errorD100, #c93241));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-errorD100, #c93241));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-errorBase, #dc3545));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-errorBase, #dc3545));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-errorBase, #dc3545));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-errorBase, #dc3545));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-errorL100, #e7727d));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-errorL400, #fbebec));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-errorL400, #fbebec));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-errorL300, #f5c2c7));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-errorL300, #f5c2c7));
          }

          .rb-button__error.rb-button__stroke .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color: var(--c-rb-btn-border-color, var(--c-rb-errorBase, #dc3545));

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-errorD100, #c93241));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, var(--c-rb-errorD100, #c93241));

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, var(--c-rb-errorBase, #dc3545));

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, var(--c-rb-errorBase, #dc3545));
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-errorL100, #e7727d));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, var(--c-rb-grayscaleWhite, #ffffff));
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, var(--c-rb-errorL200, #ee9aa2));

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-errorL400, #fbebec));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-errorL200, #ee9aa2));
          }

          .rb-button__error.rb-button__text .rb-button__element {
            /* Default */
            --rb-btn-bg: var(--c-rb-btn-bg, transparent);
            --rb-btn-color: var(--c-rb-btn-color, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color: var(--c-rb-btn-border-color, transparent);

            /* Hover */
            --rb-btn-bg-hover: var(--c-rb-btn-bg-hover, transparent);
            --rb-btn-color-hover: var(--c-rb-btn-color-hover, var(--c-rb-errorD100, #c93241));
            --rb-btn-border-color-hover: var(--c-rb-btn-border-color-hover, transparent);

            /* Pressed */
            --rb-btn-bg-pressed: var(--c-rb-btn-bg-pressed, transparent);
            --rb-btn-color-pressed: var(--c-rb-btn-color-pressed, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color-pressed: var(--c-rb-btn-border-color-pressed, transparent);

            /* Focus */
            --rb-btn-bg-focus: var(--c-rb-btn-bg-focus, transparent);
            --rb-btn-color-focus: var(--c-rb-btn-color-focus, var(--c-rb-errorBase, #dc3545));
            --rb-btn-border-color-focus: var(--c-rb-btn-border-color-focus, transparent);
            --rb-btn-box-shadow-focus: var(--c-rb-btn-box-shadow-focus, 0 0 0 1px #ffffff, 0 0 0 3px var(--c-rb-errorL100, #e7727d));

            /* Disabled */
            --rb-btn-bg-disabled: var(--c-rb-btn-bg-disabled, transparent);
            --rb-btn-color-disabled: var(--c-rb-btn-color-disabled, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled: var(--c-rb-btn-border-color-disabled, transparent);

            /* Disabled - Hover */
            --rb-btn-bg-disabled-hover: var(--c-rb-btn-bg-disabled-hover, var(--c-rb-errorL400, #fbebec));
            --rb-btn-color-disabled-hover: var(--c-rb-btn-color-disabled-hover, var(--c-rb-errorL200, #ee9aa2));
            --rb-btn-border-color-disabled-hover: var(--c-rb-btn-border-color-disabled-hover, var(--c-rb-errorL400, #fbebec));
          }

          /* LOADING ANIMATION STYLES */
          .rb-button__animation .rb-button__element::before {
            background: var(--rb-btn-bg-loading-animation);
            border-radius: 0 var(--rb-btn-border-radius) var(--rb-btn-border-radius) 0;
            animation-duration: var(--rb-btn-loading-animation-duration) !important;
          }

          .rb-button__loading.rb-button__animation .rb-button__element::before {
            animation: moverGradiente linear infinite;
            animation-duration: var(--rb-btn-loading-animation-duration) !important;
          }

          /* LOADING SIN ANIMATION: Solo posición relativa para el icono de loading */
          .rb-button__loading .rb-button__element {
            position: relative;
            z-index: 1;
          }

          /* LOADING CON ANIMATION: Agrega overflow y ::before para la barra */
          .rb-button__loading.rb-button__animation .rb-button__element {
            overflow: hidden; /* Solo cuando hay animación */
          }

          .rb-button__loading.rb-button__animation .rb-button__element::before {
            content: '';
            position: absolute;
            top: 0;
            left: -110%;
            width: 110%;
            height: 100%;
            transition: all 1s ease;
            z-index: 0;
            background: var(--rb-btn-bg-loading-animation);
            border-radius: 0 var(--rb-btn-border-radius) var(--rb-btn-border-radius) 0;
            animation: moverGradiente linear infinite;
            animation-duration: var(--rb-btn-loading-animation-duration) !important;
          }

          .rb-button__loading.rb-button__animation .rb-button__label {
            z-index: 1;
            position: relative;
          }

          .rb-button__disabled.rb-button__animation .rb-button__element::before {
            background: var(--rb-btn-bg-loading-animation-disabled);
          }
        `}
      </style>
    <div
      className={cn(
        'rb-button',
        getButtonClasses(),
        custom.className
      )}
      style={custom.style}
    >
      <button
        ref={buttonRef}
        type={custom.type || 'button'}
        disabled={custom.disabled || custom.loading}
        name={custom.name}
        data-qa-id={custom.dataQaId}
        onClick={custom.onClick}
        onKeyDown={custom.onKeyDown}
        className="rb-button__element"
      >
        {/* Left icon or loading icon */}
        {!custom.iconPosition || custom.iconPosition === 'left' ? renderIcon('left') : null}
        
        {/* Button label - always show if defined */}
        {custom.label && (
          <span className="rb-button__label">
            {custom.label}
          </span>
        )}
        
        {/* Right icon */}
        {custom.iconPosition === 'right' ? renderIcon('right') : null}
      </button>
    </div>
    </div>
  );
};
