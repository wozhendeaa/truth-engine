import { useTranslation as useNextTranslation } from 'next-i18next';
import { useTranslation as useReactTranslation } from 'react-i18next';

export function useTranslation() {
  const { ready: isNextReady, ...nextProps } = useNextTranslation();
  const { ready: isReactReady, ...reactProps } = useReactTranslation();

  if (isNextReady) {
    return { ready: isNextReady, ...nextProps };
  } else {
    return { ready: isReactReady, ...reactProps };
  }
}