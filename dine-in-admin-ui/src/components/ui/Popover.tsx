import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

interface PopoverProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  /**
   * auto: closes when clicking the backdrop or pressing Escape
   * manual: must be closed via hide() or discrete close button
   */
  mode?: 'auto' | 'manual';
}

export interface PopoverHandle {
  show: () => void;
  hide: () => void;
  toggle: () => void;
}

const Popover = forwardRef<PopoverHandle, PopoverProps>(({ 
  children, 
  id, 
  className = '', 
  style,
  onClose,
  mode = 'auto'
}, ref) => {
  const innerRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      if (innerRef.current && !innerRef.current.open) {
        innerRef.current.showModal();
      }
    },
    hide: () => {
      if (innerRef.current && innerRef.current.open) {
        innerRef.current.close();
      }
    },
    toggle: () => {
      if (innerRef.current) {
        if (innerRef.current.open) {
          innerRef.current.close();
        } else {
          innerRef.current.showModal();
        }
      }
    }
  }));

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const handleClose = () => {
      if (onClose) {
        onClose();
      }
    };

    el.addEventListener('close', handleClose);
    return () => el.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (mode === 'manual') return;
    
    const dialog = innerRef.current;
    if (!dialog) return;
    
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    
    if (!isInDialog) {
      dialog.close();
    }
  };

  return (
    <dialog
      id={id}
      ref={innerRef}
      style={style}
      onClick={handleBackdropClick}
      className={`
        m-auto ring-0 border-none bg-transparent outline-none
        backdrop:bg-surface-950/60 backdrop:backdrop-blur-sm
        open:animate-in open:zoom-in-95 open:fade-in open:duration-300
        ${className}
      `}
    >
      {children}
    </dialog>
  );
});

Popover.displayName = 'Popover';

export default Popover;
