import * as DialogPrimitive from '@radix-ui/react-dialog';
import { MdClose } from 'react-icons/md';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogOverlay({ className = '', ...props }) {
  return <DialogPrimitive.Overlay className={className} {...props} />;
}

export function DialogContent({
  className = '',
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay className="app-dialog__overlay" />
      <DialogPrimitive.Content className={className} {...props}>
        {children}
        {showCloseButton && (
          <DialogClose className="app-dialog__close" aria-label="Close">
            <MdClose />
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogTitle({ className = '', ...props }) {
  return <DialogPrimitive.Title className={className} {...props} />;
}

export function DialogDescription({ className = '', ...props }) {
  return <DialogPrimitive.Description className={className} {...props} />;
}
