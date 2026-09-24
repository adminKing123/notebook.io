import { useEffect } from 'react';
import { APP_NAME } from '../config';

export function useDocumentTitle(title = APP_NAME) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
