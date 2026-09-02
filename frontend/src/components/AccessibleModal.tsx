import { KeyboardEvent, ReactNode, RefObject, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
  onFechar: () => void;
  labelledBy: string;
  describedBy?: string;
  role?: 'dialog' | 'alertdialog';
  className?: string;
  initialFocusRef?: RefObject<HTMLElement>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function AccessibleModal({
  children,
  onFechar,
  labelledBy,
  describedBy,
  role = 'dialog',
  className = '',
  initialFocusRef,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const appRoot = document.getElementById('root');
    const previousBodyOverflow = document.body.style.overflow;
    const appRootWasInert = appRoot?.hasAttribute('inert') ?? false;

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    appRoot?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';

    const focusTarget = initialFocusRef?.current ?? dialogRef.current;
    focusTarget?.focus();

    return () => {
      if (appRoot && !appRootWasInert) {
        appRoot.removeAttribute('inert');
      }
      document.body.style.overflow = previousBodyOverflow;

      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) {
        previousFocus.focus();
      }
    };
  }, [initialFocusRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onFechar();
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    const activeElementIsTabbable = activeElement instanceof HTMLElement
      && focusableElements.includes(activeElement);

    if (event.shiftKey && (activeElement === first || !activeElementIsTabbable)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        className={`modal-box ${className}`.trim()}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
