import React, { MouseEventHandler, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useStyles } from './icon-button.styles';

interface IconButtonProps {
  className?: string;
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const IconButtonRaw: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  PropsWithChildren<IconButtonProps>
> = ({ children, disabled, onButtonClick, className, ...props }, ref) => {
  const classes = useStyles();
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(classes.iconButton, className)}
      ref={ref}
      onClick={onButtonClick}
      {...props}
    >
      {children}
    </button>
  );
};

const IconButton = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IconButtonProps>
>(IconButtonRaw);

export default IconButton;
