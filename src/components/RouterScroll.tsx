import { FC, ReactElement, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = { children: ReactNode };

export const RouterScroll: FC<Props> = (props: Props): ReactElement => {
  const { pathname } = useLocation();

  useEffect(() => document.documentElement.scrollTo({ top: 0, left: 0 }), [pathname]);

  return <>{props.children}</>;
}
