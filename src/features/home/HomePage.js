import React from 'react';

import Disclaimer from 'components/Disclaimer/Disclaimer';
import StableYield from 'features/stableyield/stableyield';

export default function HomePage() {
  return (
    <>
      {/*<Disclaimer />*/}
      <StableYield fromPage="home" />
    </>
  );
}
