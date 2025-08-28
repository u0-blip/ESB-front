import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_PACKAGES_QL } from '../../http/graphqlQuerys';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import PaginationComp from '../Pagination/Pagination';
import Spacer from '../Spacer/Spacer';
import { CREATE_OR_SAVE_PACKAGE_QL } from '../../http/graphqlMutations';
import { MODAL_TYPES } from '../../utils/constants';

import './AdminPackagesSection.scss';

function AdminPackagesSection(props) {
  const [packages, setPackages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [packageId, setPackageId] = useState(undefined);
  const [packageTitle, setPackageTitle] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageCredits, setPackageCredits] = useState(undefined);
  const [packagePriceInCents, setPackagePriceInCents] = useState(undefined);
  const [packageEnternalPlanId, setPackageEnternalPlanId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [packagesPerPage, setPackagesPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  // TOAST
  const { addToast } = useToasts();

  useEffect(() => {
    loadPackages(1, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPackages = async (currentPage, packagesPerPage) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: packagesPerPage,
      sort: ['credits'],
      sortDir: ['ASC']
    };

    const usersData = await ExecGraphQl(LIST_PACKAGES_QL, gqlVariables);
    if (usersData?.data?.ListPackages?.rows) {
      setPackages(usersData.data.ListPackages.rows);
      setCurrentPage(usersData.data.ListPackages.page + 1);
      setPackagesPerPage(usersData.data.ListPackages.pageSize);
      setTotalPages(usersData.data.ListPackages.totalPages);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const handleClickSave = async () => {
    const packageParams = {
      id: packageId,
      title: packageTitle,
      description: packageDescription,
      credits: packageCredits,
      priceInCents: packagePriceInCents,
      ExternalPlanId: packageEnternalPlanId
    };
    const savePackageResult = await ExecGraphQl(CREATE_OR_SAVE_PACKAGE_QL, packageParams);
    if (packageParams.id < 0 && savePackageResult?.data?.CreateOrSavePackage === null) {
      addToast('Package deleted successfully!', { appearance: 'success', autoDismiss: true });
    } else if (savePackageResult?.data?.CreateOrSavePackage?.id) {
      addToast('Package updated successfully!', { appearance: 'success', autoDismiss: true });
    } else {
      addToast('Something went wrong, please try again!', { appearance: 'error', autoDismiss: true });
    }
    loadPackages(1, 30);
    setShowModal(false);
  };

  const handlePaginationClick = pageItem => {
    loadPackages(pageItem, packagesPerPage);
  };

  const handleClickAddPackage = () => {
    setPackageId(undefined);
    setPackageTitle('');
    setPackageDescription('');
    setPackageEnternalPlanId('');
    setPackageCredits(0);
    setPackagePriceInCents(0);
    setModalType(MODAL_TYPES.UPDATE);
    setShowModal(true);
  };

  const handleClickEditPackage = packageObj => {
    const packageToEdit = {
      id: packageObj.id,
      title: packageObj.title,
      description: packageObj.description,
      credits: packageObj.credits,
      priceInCents: packageObj.priceInCents,
      ExternalPlanId: packageObj.ExternalPlanId
    };
    setPackageId(packageToEdit.id);
    setPackageTitle(packageToEdit.title);
    setPackageDescription(packageToEdit.description);
    setPackageCredits(packageToEdit.credits);
    setPackagePriceInCents(packageToEdit.priceInCents);
    setPackageEnternalPlanId(packageToEdit.ExternalPlanId);
    setModalType(MODAL_TYPES.UPDATE);
    setShowModal(true);
  };

  const handleClickDeletePackage = packageObj => {
    const packageToEdit = {
      id: packageObj.id,
      title: packageObj.title,
      description: packageObj.description,
      credits: packageObj.credits,
      priceInCents: packageObj.priceInCents,
      ExternalPlanId: packageObj.ExternalPlanId
    };
    setPackageId(packageToEdit.id * -1);
    setPackageTitle(packageToEdit.title);
    setPackageDescription(packageToEdit.description);
    setPackageCredits(packageToEdit.credits);
    setPackagePriceInCents(packageToEdit.priceInCents);
    setPackageEnternalPlanId(packageToEdit.ExternalPlanId);
    setModalType(MODAL_TYPES.CONFIRMATION);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getActionButtons = item => {
    return (
      <div className='isFlex'>
        {getEditButton(item)}
        {getDeleteButton(item)}
      </div>
    );
  };

  const getEditButton = item => {
    return (
      <Button
        className='margin-4'
        label='edit'
        handleClick={() => handleClickEditPackage(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-pen' />
      </Button>
    );
  };

  const getDeleteButton = item => {
    return (
      <Button
        className='margin-4'
        label='delete'
        handleClick={() => handleClickDeletePackage(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-trash' />
      </Button>
    );
  };

  const getRows = () => {

    return packages.map(item => [
      item.title,
      item.description,
      item.credits,
      item.priceInCents,
      item.ExternalPlanId,
      getActionButtons(item)
    ]);
  };

  const getModalEditPackage = () => {
    return (
      <div className='AdminPackagesSectionModal notification'>
        <div className='subtitle is-capitalized'>edit package info</div>

        {/* ### Title field ### */}
        <Field label='Title'>
          <Input disabled={{ disabled: false }} type='text' value={packageTitle} onChange={value => setPackageTitle(value)} />
        </Field>

        {/* ### Description field ### */}
        <Field label='Description'>
          <Input disabled={{ disabled: false }} type='text' value={packageDescription} onChange={value => setPackageDescription(value)} />
        </Field>

        {/* ### Credits field ### */}
        <Field label='Credits'>
          <Input disabled={{ disabled: false }} type='number' value={packageCredits} onChange={value => setPackageCredits(+value)} />
        </Field>

        {/* ### PriceInCents field ### */}
        <Field label='Price in cents'>
          <Input disabled={{ disabled: false }} type='number' value={packagePriceInCents} onChange={value => setPackagePriceInCents(+value)} />
        </Field>

        {/* ### ExternalPlanId field ### */}
        <Field label='External plan id'>
          <Input disabled={{ disabled: false }} type='text' value={packageEnternalPlanId} onChange={value => setPackageEnternalPlanId(value)} />
        </Field>

        <div className='buttons'>
          <Button
            label='close'
            handleClick={handleCloseModal}
            color={COLORS.DARK}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
          </Button>
          <Button
            label='save'
            handleClick={handleClickSave}
            color={COLORS.DARK}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-check' />
          </Button>
        </div>
      </div>
    );
  };

  const getModalConfirmationFields = () => {
    return (
      <div className='notification'>
        <div className='title'>Delete Package</div>
        <div className='subtitle'>Are you sure you want to delete the package selected?</div>
        <div className='buttons'>
          <div className='button' onClick={() => setShowModal(false)}>
            Cancel
          </div>
          <button className='button is-dark' onClick={handleClickSave}>
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const getModalFields = modalTypeParam => {
    switch (modalTypeParam) {
      case MODAL_TYPES.CONFIRMATION:
        return getModalConfirmationFields();

      case MODAL_TYPES.UPDATE:
        return getModalEditPackage();

      default:
        return null;
    }
  };

  return (
    <Section>
      <Modal showModal={showModal} handleClose={handleCloseModal} render={() => getModalFields(modalType)} />
      <div className='AdminDashboardSectionComponent container'>
        <SectionHeader title='Packages' subtitle='Manage Packages' fontColor={COLORS.BLACK} fontSize='' />

        <Button
          label='create'
          handleClick={() => handleClickAddPackage()}
          color={COLORS.DARK}
          vibrateOnClick={true}
          isUpperCase={true}
        >
          <Icon size={ICON_SIZES.SMALL} name='fas fa-plus-circle' />
        </Button>
        <Spacer />
        <Spacer />

        <div className='box'>
          {!!getRows() && !!getRows().length ? (
            <Table headers={['Title', 'Description', 'Credits', 'Price in cents', 'External plan id', 'Actions']} rows={getRows()} />
          ) : (
            <div className='subtitle has-text-centered'>No data available to display!</div>
          )}
        </div>

        <PaginationComp
          page={currentPage}
          pageSize={packagesPerPage}
          totalPages={totalPages}
          handlePageClick={handlePaginationClick}
        />
      </div>
    </Section>
  );
}

export default AdminPackagesSection;
