import React, { useRef, useEffect } from 'react';
import styles from './Page.module.scss';
import { Link } from 'gatsby';

type Props = {
  title?: string,
  hideHomeButton?: boolean,
  children: React.Node
};

const Page = ({ title, hideHomeButton, children }: Props) => {
  const pageRef = useRef();

  useEffect(() => {
    pageRef.current.scrollIntoView();
  });

  return (
    <div ref={pageRef} className={styles['page']}>
      <div className={styles['page__inner']}>

        { !hideHomeButton && <Link className={styles['back-button']} to="/">&lt; Home</Link> }

        { title && <h1 className={styles['page__title']}>{title}</h1>}

        <div className={styles['page__body']}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Page;