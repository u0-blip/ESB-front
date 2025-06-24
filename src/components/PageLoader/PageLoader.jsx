import React, { useEffect, useState } from 'react';
import { LoaderService } from '../../service/LoaderService';

import './PageLoader.scss';

const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    LoaderService.isLoading().subscribe(isLoading => {
      setShowLoader(isLoading);
    });
  }, []);

  return (
    <>
      {showLoader && (
        <div id="cssload-loader-wrapper" className={!showLoader ? 'hideLoader' : ''}>
          <div id="cssload-loader" className={!showLoader ? 'hideLoader' : ''}>Loading ESB</div>
        </div>
      )}
    </>
  );
};

export default PageLoader;
