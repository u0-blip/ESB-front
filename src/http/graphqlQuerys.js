export const LIST_PICKS_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $filter: PickFilter) {
    ListPicks(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: $filter) {
      page
      pageSize
      totalPages
      totalRecords
      rows {
        id
        SportId
        AwayCompetitorId
        HomeCompetitorId
        status
        summary
        matchTime
        title
        SportFld {
          id
          shortTitle
          title
        }
        AwayCompetitorFld {
          id
          logo
          name
        }
        HomeCompetitorFld {
          id
          logo
          name
        }
      }
    }
  }
`;

export const listPicksQl = (fieldsToHide = [], bringOnlyId) => {
  let pickDefaultFields = `
    id
    SportId
    AwayCompetitorId
    HomeCompetitorId
    status
    summary
    matchTime
    title
    SportFld {
      id
      shortTitle
      title
    }
    AwayCompetitorFld {
      id
      logo
      name
    }
    HomeCompetitorFld {
      id
      logo
      name
    }
  `;

  if (bringOnlyId) {
    pickDefaultFields = `
      id
    `;
  }

  let pickFields = `${pickDefaultFields}`;

  fieldsToHide.forEach(fieldToHide => {
    pickFields = pickDefaultFields.replace(fieldToHide, '');
  });

  return `
    query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $filter: PickFilter) {
      ListPicks(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: $filter) {
        page
        pageSize
        totalPages
        totalRecords
        rows {
          ${pickFields}
        }
      }
    }
  `;
};

export const LIST_ADMIN_PICKS_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $filter: PickFilter) {
    ListPicks(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: $filter) {
      page
      pageSize
      totalPages
      totalRecords
      rows {
        id
        SportId
        AwayCompetitorId
        HomeCompetitorId
        status
        summary
        matchTime
        title
        isFeatured
        analysis
        SportFld {
          id
          shortTitle
          title
        }
        AwayCompetitorFld {
          id
          logo
          name
        }
        HomeCompetitorFld {
          id
          logo
          name
        }
      }
    }
  }
`;

export const LIST_SPORTS_QL = `
  query gqlQuery {
    ListSports(page: 0, pageSize: 100, sort: ["shortTitle"], sortDir: ASC) {
      rows {
        id
        shortTitle
        title
      }
    }
  }
`;

export const LIST_TEAMS_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $sportId: Int) {
    ListTeams: ListCompetitors(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: {SportId: $sportId}) {
      totalRecords
      page
      pageSize
      totalPages
      rows {
        id
        SportId
        name
        logo
        SportFld {
          value: id
          label: shortTitle
        }
      }
    }
  }
`;

export const LIST_PACKAGES_QL = `
  query gqlQuery {
    ListPackages(sort: ["priceInCents"], sortDir: [ASC]) {
      rows {
        id
        title
        description
        ExternalPlanId
        credits
        priceInCents
      }
    }
  }
`;

export const LIST_UNLOCKED_PICK_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $userId: Int, $createdAt: String, $op: OPERATOR) {
    ListUnlockedPicks(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: {UserId: $userId, createdAt: {op: $op, value: $createdAt}}) {
      page
      pageSize
      totalPages
      totalRecords
      rows {
        id
        UserId
        PickId
        createdAt
        UserFld {
          email
          name
        }
        PickFld {
          id
          SportId
          AwayCompetitorId
          HomeCompetitorId
          status
          summary
          matchTime
          title
          SportFld {
            id
            shortTitle
            title
          }
          AwayCompetitorFld {
            id
            logo
            name
          }
          HomeCompetitorFld {
            id
            logo
            name
          }
        }
      }
    }
  }
`;

export const LIST_CREDIT_PURCHASES_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [SORT_DIRECTION], $userId: Int) {
    ListCreditPurchases(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: {UserId: $userId}) {
      page
      pageSize
      totalPages
      totalRecords
      rows {
        credits
        priceInCents
        createdAt
        PackageFld {
          title
          description
        }
        UserFld {
          name
          email
        }
      }
    }
  }
`;

export const listCreditPurchases = (fieldsToHide = []) => {
  const defaultFields = `
    id
    UserId
    credits
    priceInCents
  `;

  let fields = `${defaultFields}`;

  fieldsToHide.forEach(fieldToHide => {
    fields = fields.replace(fieldToHide, '');
  });

  return `
    query gqlQuery($page: Int, $pageSize: Int, $userId: Int) {
      ListCreditPurchases(page: $page, pageSize: $pageSize, filter: {UserId: $userId}) {
        rows {
          ${fields}
        }
      }
    }
  `;
};

export const GET_PICK_BY_ID_QL = `
  query gqlQuery($pickId: ID!) {
    GetPick(id: $pickId) {
      id
      SportId
      AwayCompetitorId
      HomeCompetitorId
      status
      summary
      matchTime
      title
      analysis
      SportFld {
        id
        shortTitle
        title
      }
      AwayCompetitorFld {
        id
        logo
        name
      }
      HomeCompetitorFld {
        id
        logo
        name
      }
    }
  }
`;

export const listUsersQl = (fieldsToHide = []) => {
  const userDefaultFields = `
    id
    cognitoUserId
    email
    name
    myReferralCode
    otherReferralCode
    credits
    roles
    createdAt
  `;

  let userFields = `${userDefaultFields}`;

  fieldsToHide.forEach(fieldToHide => {
    userFields = userFields.replace(fieldToHide, '');
  });

  return `
    query gqlQuery($pageSize: Int, $userId: Int) {
      ListUsers(pageSize: $pageSize, filter: {id: $userId}) {
        totalRecords
        rows {
         ${userFields}
        }
      }
    }
  `;
};

export const LIST_USERS_QL = `
  query gqlQuery($page: Int, $pageSize: Int, $sort: [String], $sortDir: [String], $userId: Int, $email: String) {
    ListUsers(page: $page, pageSize: $pageSize, sort: $sort, sortDir: $sortDir, filter: {id: $userId, email: $email}) {
      page
      pageSize
      totalPages
      totalRecords
      rows {
        id
        cognitoUserId
        name
        email
        myReferralCode
        otherReferralCode
        credits
        dateOfBirth
        phone
        roles
        createdAt
      }
    }
  }
`;

export const GET_PICK_STATS_QL = `
  query gqlQuery($sportId: Int) {
    GetPickStats(SportId: $sportId) {
      percentage7D
      percentageALL
    }
  }
`;
