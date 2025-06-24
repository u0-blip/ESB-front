import React from 'react';
import PickDetailSection from '../../components/PickDetailSection/PickDetailSection';
import { ToastProvider } from 'react-toast-notifications';
import { useRouter } from '../../utils/router';

const PickDetail = props => {

  // ROUTER
  const router = useRouter();
  const pickId = +router?.query?.id;

  return (
    <ToastProvider>
      <PickDetailSection pickId={pickId} />
    </ToastProvider>
  )
}

export default PickDetail;