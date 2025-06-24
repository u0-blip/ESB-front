import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import SectionHeader from '../SectionHeader/SectionHeader';
import Section from '../Section/Section';
import PackageCard from '../PackageCard/PackageCard';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';

// UTILS
import { COLORS } from '../../utils/enums';
import { useRouter } from '../../utils/router';
import { MENU_ITEM, LOCALSTORAGE_KEYS } from '../../utils/constants';

// GRAPHQL
import { ExecGraphQl } from '../../http/httpService';
import { LIST_PACKAGES_QL } from '../../http/graphqlQuerys';
import { CREATE_OR_SAVE_CREDIT_PURCHASE_QL } from '../../http/graphqlMutations';

function PackagesSection(props) {
  const [showModal, setShowModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const router = useRouter();

  // TOAST
  const { addToast } = useToasts();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const packagesData = await ExecGraphQl(LIST_PACKAGES_QL, {
      page: 0,
      pageSize: 5,
      sort: ['id'],
      sortDir: ['DESC']
    });
    setPackages(packagesData.data.ListPackages.rows);
  };

  const handlePaymentSuccess = async (packageId, paypalPaymentResponse) => {
    try {
      const result = await ExecGraphQl(CREATE_OR_SAVE_CREDIT_PURCHASE_QL, {
        userId: parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID), 10),
        packageId: parseInt(packageId, 10),
        callbackKey: paypalPaymentResponse.returnUrl,
        externalChargeId: paypalPaymentResponse.paymentID,
        externalPaymentProcessor: 'PAYPAL',
        startedAt: moment().format()
      });
      if (result?.data?.CreateOrSaveCreditPurchase?.id) {
        return router.push(MENU_ITEM.PAYMENT_SUCCESS.PATH);
      } else {
        addToast('Payment with paypal was precessed, but we have problems to update your credits!', { appearance: 'error', autoDismiss: true });
      }
    } catch (error) {
      addToast('Payment with paypal was precessed, but we have problems to update your credits!', { appearance: 'error', autoDismiss: true });
    }
  };

  return (
    <>
      <Modal showModal={showModal} handleClose={() => setShowModal(false)} render={() => <p>Payment successful!</p>} />
      <Section sectionSize="">
        <Loader isActive={false} />
        <div className="container">
          <SectionHeader title="PRICING" subtitle="First time customer? Try our standard trade. Looking to get more out of Elite Sports Bets? Go Gold!" fontColor={COLORS.BLACK} fontSize="" />

          <br />

          <div className="pricing-table">
            {packages.map((data, idx) => {
              return (
                <PackageCard
                  key={idx}
                  packageId={data.id}
                  packageName={data.title}
                  packagePrice={data.priceInCents ? data.priceInCents / 100 : ''}
                  packageBilling={'month'}
                  handlePaymentSuccess={handlePaymentSuccess}
                  packageItems={[
                    idx => (
                      <div key={idx} className="plan-item">
                        <p>
                          <strong>{data.description.substring(0, data.description.length - 31)}</strong>
                        </p>
                        <p>{data.description.substring(data.description.length - 31)}</p>
                      </div>
                    )
                  ]}
                />
              );
            })}
          </div>

          <br />
          <div className="columns">
            <div className="column is-8 is-offset-2">
              <div className="content is-size-7">
                <p>
                  *GUARANTEED = if the pick does not win, you will receive another credit/s until you win. Contact us if you need to redeem your free credit. This means that you will only be deducted a credit if the pick you unlock wins. If the pick we provide
                  is incorrect, you will receive another credit until you unlock a winning pick. Please note: This does not guarantee a profit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default PackagesSection;
