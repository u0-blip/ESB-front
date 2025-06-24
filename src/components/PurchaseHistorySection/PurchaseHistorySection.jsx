import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import moment from 'moment';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Spacer from '../Spacer/Spacer';
import PaginationComp from '../Pagination/Pagination';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_CREDIT_PURCHASES_QL } from '../../http/graphqlQuerys';
import { useAuth } from '../../utils/auth';

import './PurchaseHistorySection.scss';

const PurchaseHistorySection = () => {
  const [creditPurchases, setCreditPurchases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [creditPurchaseTitle, setCreditPurchaseTitle] = useState('');
  const [creditPurchaseDescription, setCreditPurchaseDescription] = useState('');
  const [creditPurchaseCredits, setCreditPurchaseCredits] = useState(0);
  const [creditPurchasePriceInCents, setCreditPurchasePriceInCents] = useState(0);
  const [creditPurchaseCreated, setCreditPurchaseCreated] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [creditPurchasesPerPage, setCreditPurchasesPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  // TOAST
  const { addToast } = useToasts();

  // AUTH
  const auth = useAuth();

  useEffect(() => {
    loadCreditPurchases(1, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCreditPurchases = async (currentPage, creditPurchasesPerPage) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: creditPurchasesPerPage,
      userId: auth.isAdminUser() ? undefined : auth.user?.userId,
      sort: ['createdAt'],
      sortDir: ['DESC'],
    };

    const creditPurchasesData = await ExecGraphQl(LIST_CREDIT_PURCHASES_QL, gqlVariables);
    if (creditPurchasesData?.data?.ListCreditPurchases?.rows) {
      setCreditPurchases(creditPurchasesData.data.ListCreditPurchases.rows);
      setCurrentPage(creditPurchasesData.data.ListCreditPurchases.page + 1);
      setCreditPurchasesPerPage(creditPurchasesData.data.ListCreditPurchases.pageSize);
      setTotalPages(creditPurchasesData.data.ListCreditPurchases.totalPages);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const handlePaginationClick = pageItem => {
    loadCreditPurchases(pageItem, creditPurchasesPerPage);
  };

  const handleClickViewCreditPurchase = creditPurchaseObj => {
    const creditPurchaseToView = {
      name: creditPurchaseObj.UserFld?.name,
      email: creditPurchaseObj.UserFld?.email,
      title: creditPurchaseObj.PackageFld?.title,
      description: creditPurchaseObj.PackageFld?.description,
      credits: +creditPurchaseObj.credits,
      priceInCents: +creditPurchaseObj.priceInCents,
      createdAt: creditPurchaseObj.createdAt,
    };
    setUserName(creditPurchaseToView.name);
    setUserEmail(creditPurchaseToView.email);
    setCreditPurchaseTitle(creditPurchaseToView.title);
    setCreditPurchaseDescription(creditPurchaseToView.description);
    setCreditPurchaseCredits(creditPurchaseToView.credits);
    setCreditPurchasePriceInCents(creditPurchaseToView.priceInCents);
    setCreditPurchaseCreated(creditPurchaseToView.createdAt);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getActionButtons = item => {
    return (
      <div className='isFlex'>
        {getViewButton(item)}
      </div>
    );
  };

  const getViewButton = item => {
    return (
      <Button
        label='View'
        className='margin-4'
        handleClick={() => handleClickViewCreditPurchase(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-search' />
      </Button>
    );
  };

  const getCreated = (created = '') => {
    return moment(created).format('DD/MM/YYYY');
  };

  const getPrice = (priceInCents = 0) => {
    return `$${priceInCents / 100}`;
  };

  const getHeaders = () => {
    const headers = ['Name', 'Email', 'Title', 'Description', 'Credits', 'Price', 'Created', 'Action'];
    const removeHeaders = auth.isAdminUser() ? [] : ['Name', 'Email'];

    return headers.filter(header => {
      return !removeHeaders.includes(header);
    });
  };

  const getRows = () => {
    return auth.isAdminUser() ? getAdminRows() : getUserRows();
  };

  const getUserRows = () => {
    return creditPurchases.map(item => [
      item.PackageFld?.title,
      item.PackageFld?.description,
      item.credits || '0',
      getPrice(item.priceInCents),
      getCreated(item.createdAt),
      getActionButtons(item),
    ]);
  };

  const getAdminRows = () => {
    return creditPurchases.map(item => [
      item.UserFld?.name,
      item.UserFld?.email,
      item.PackageFld?.title,
      item.PackageFld?.description,
      item.credits || '0',
      getPrice(item.priceInCents),
      getCreated(item.createdAt),
      getActionButtons(item),
    ]);
  };

  const getModalFields = () => {
    return (
      <div className='PurchaseHistorySectionModal notification'>
        <div className='subtitle is-capitalized'>Purchase History Info</div>

        {auth.isAdminUser() && (
          <>
            {/* ### Name field ### */}
            <Field label='Name'>
              <Input disabled={{ disabled: true }} type='text' value={userName} />
            </Field>

            {/* ### Email field ### */}
            <Field label='Email'>
              <Input disabled={{ disabled: true }} type='text' value={userEmail} />
            </Field>
          </>
        )}

        {/* ### Title field ### */}
        <Field label='Title'>
          <Input disabled={{ disabled: true }} type='text' value={creditPurchaseTitle} />
        </Field>

        {/* ### Description field ### */}
        <Field label='Description'>
          <Input disabled={{ disabled: true }} type='text' value={creditPurchaseDescription} />
        </Field>

        {/* ### Credits field ### */}
        <Field label='Credits'>
          <Input disabled={{ disabled: true }} type='text' value={creditPurchaseCredits} />
        </Field>

        {/* ### Price field ### */}
        <Field label='Price'>
          <Input disabled={{ disabled: true }} type='text' value={getPrice(creditPurchasePriceInCents)} />
        </Field>

        {/* ### Created field ### */}
        <Field label='Created'>
          <Input disabled={{ disabled: true }} type='text' value={getCreated(creditPurchaseCreated)} />
        </Field>

        <Button
          label='close'
          handleClick={handleCloseModal}
          color={COLORS.DARK}
          vibrateOnClick={true}
          isUpperCase={true}
        >
          <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
        </Button>
      </div>
    );
  };

  return (
    <Section>
      <Modal showModal={showModal} handleClose={handleCloseModal} render={() => getModalFields()} />
      <div className='CreditPurchaseDashboardSectionComponent container'>
        <SectionHeader title='Purchase History' fontColor={COLORS.BLACK} fontSize='' />
        <Spacer />
        <Spacer />

        <div className='box'>
          {!!getRows() && !!getRows().length ? (
            <Table headers={getHeaders()} rows={getRows()} />
          ) : (
            <div className='subtitle has-text-centered'>No data available to display!</div>
          )}
        </div>

        <PaginationComp
          page={currentPage}
          pageSize={creditPurchasesPerPage}
          totalPages={totalPages}
          handlePageClick={handlePaginationClick}
        />
      </div>
    </Section>
  );
};

export default PurchaseHistorySection;
