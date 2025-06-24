export const CREATE_OR_SAVE_USER = `
  mutation gqlMutation($id: Int, $cognitoUserId: String!, $email: String!, $dob: Date, $phone: String, $name: String!, $credits: Int, $myReferralCode: String, $otherReferralCode: String, $roles: [String], $creditType: CREDIT_TYPES) {
    CreateOrSaveUser(user: {id: $id, cognitoUserId: $cognitoUserId, email: $email, dateOfBirth: $dob, phone: $phone, name: $name, credits: $credits, myReferralCode: $myReferralCode, otherReferralCode: $otherReferralCode, roles: $roles, creditType: $creditType}) {
      id
      cognitoUserId
      email
      name
      dateOfBirth
      phone
      myReferralCode
      otherReferralCode
      credits
      roles
      updatedAt
    }
  }
`;

export const CREATE_OR_SAVE_CREDIT_PURCHASE_QL = `
  mutation gqlMutation($userId: Int!, $packageId: Int!, $callbackKey: String, $externalChargeId: String, $externalPaymentProcessor: String, $startedAt: DateTime!) {
    CreateOrSaveCreditPurchase(creditPurchase: {UserId: $userId, PackageId: $packageId, callbackKey: $callbackKey, ExternalChargeId: $externalChargeId, ExternalPaymentProcessor: $externalPaymentProcessor, startedAt: $startedAt}) {
      id
      UserId
      PackageId
      callbackKey
      ExternalChargeId
      priceInCents
      credits
      createdAt
    }
  }
`;

export const CREATE_OR_SAVE_UNLOCK_PICK_QL = `
  mutation gqlMutation($userId: Int!, $pickId: Int!) {
    CreateOrSaveUnlockedPick(unlockedPick: {UserId: $userId, PickId: $pickId}) {
      id
      UserId
      PickId
      createdAt
    }
  }
`;

export const CREATE_OR_SAVE_PICK_QL = `
  mutation gqlMutation($id: Int, $sportId: Int!, $homeCompetitorId: Int!, $awayCompetitorId: Int!, $status: PICK_STATUS, $title: String!, $matchTime: DateTime!, $analysis: String!, $summary: String!, $isFeatured: Boolean) {
    CreateOrSavePick(pick: {id: $id, SportId: $sportId, HomeCompetitorId: $homeCompetitorId, AwayCompetitorId: $awayCompetitorId, status: $status, title: $title, matchTime: $matchTime, analysis: $analysis, summary: $summary, isFeatured: $isFeatured}) {
      id
    }
  }
`;

export const CREATE_OR_SAVE_COMPETITOR_QL = `
  mutation gqlMutation($id: Int, $sportId: Int!, $name: String!, $logo: String!) {
    CreateOrSaveCompetitor(competitor: {id: $id, SportId: $sportId, name: $name, logo: $logo}) {
      id
      SportId
      name
      logo
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_OR_SAVE_SPORT_QL = `
  mutation gqlMutation($id: Int, $shortTitle: String!, $title: String!) {
    CreateOrSaveSport(sport: {id: $id, shortTitle: $shortTitle, title: $title}) {
      id
      shortTitle
      title
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_OR_SAVE_PACKAGE_QL = `
  mutation gqlMutation($id: Int, $title: String!, $description: String!, $credits: Int!, $priceInCents: Int!, $ExternalPlanId: String) {
    CreateOrSavePackage(package: {id: $id, title: $title, description: $description, credits: $credits, priceInCents: $priceInCents, ExternalPlanId: $ExternalPlanId}) {
      id
      title
      description
      credits
      priceInCents
      ExternalPlanId
      createdAt
      updatedAt
    }
  }
`;
