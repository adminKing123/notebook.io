import * as DialogPrimitive from '@radix-ui/react-dialog';
import { MdClose } from 'react-icons/md';

export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className = '',
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="app-dialog__overlay" />
      <DialogPrimitive.Content className={className} {...props}>
        {children}
        {showCloseButton && (
          <DialogClose className="app-dialog__close" aria-label="Close">
            <MdClose />
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className = '', ...props }) {
  return <DialogPrimitive.Title className={className} {...props} />;
}

export function DialogDescription({ className = '', ...props }) {
  return <DialogPrimitive.Description className={className} {...props} />;
}
