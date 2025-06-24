// ### PACKAGES ### //
import React from 'react';
import LogRocket from 'logrocket';

// ### UTILS ### //
import { Switch, Route, Router } from './utils/router';
import { ProvideAuth, useAuth } from './utils/auth';
import { MENU_ITEM } from './utils/constants';

// ### PAGES ### //
import Home from './pages/Home/Home';
import Scorecard from './pages/Scorecard/Scorecard';
import Picks from './pages/Picks/Picks';
import Packages from './pages/Packages/Packages';
import PurchaseHistory from './pages/PurchaseHistory/PurchaseHistory';
import Account from './pages/Account/Account';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminSports from './pages/AdminSports/AdminSports';
import AdminTeams from './pages/AdminTeams/AdminTeams';
import AdminPicks from './pages/AdminPicks/AdminPicks';
import PickDetail from './pages/PickDetail/PickDetail';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import AdminPackages from './pages/AdminPackages/AdminPackages';

// ### COMPONENTS ### //
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import SignOut from './components/SignOut/SignOut';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import PageNotAllowed from './pages/PageNotAllowed/PageNotAllowed';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';
import PageLoader from './components/PageLoader/PageLoader';
import ReferralRedirect from './components/ReferralRedirect/ReferralRedirect';

// ### STYLES ### //
import './App.scss';

function PrivateRoute({ path, component: Component, ...rest }) {
  // AUTH
  const auth = useAuth();

  if (auth.isValidAuthorizationToken()) {
    return <Route {...rest} path={path} component={Component} />;
  } else {
    return <PageNotAllowed />;
  }
}

function App(props) {
  if (process.env.REACT_APP_ENV === 'production') {
    LogRocket.init('3sslix/esb-react-app');
  }

  return (
    <div className='AppComponent'>
      <PageLoader />
      <ProvideAuth>
        <Router>
          <>
            <Navbar color='white' isSpaced={false} isFixedTop={true} />

            <div className='page-wrapper'>
              <Switch>
                <PrivateRoute exact path={MENU_ITEM.HOME.PATH} component={Home} />

                <Route exact path={MENU_ITEM.REFERAL_REDIRECT.PATH} component={ReferralRedirect} />

                <Route exact path={MENU_ITEM.SIGNIN.PATH} component={SignIn} />

                <Route exact path={MENU_ITEM.SIGNUP.PATH} component={SignUp} />

                <Route exact path={MENU_ITEM.SIGNOUT.PATH} component={SignOut} />

                <Route exact path={MENU_ITEM.PICKS.PATH} component={Picks} />

                <Route exact path={MENU_ITEM.SCORECARD.PATH} component={Scorecard} />

                <PrivateRoute exact path={MENU_ITEM.PACKAGES.PATH} component={Packages} />

                <PrivateRoute exact path={MENU_ITEM.PURCHASE_HISTORY.PATH} component={PurchaseHistory} />

                <PrivateRoute exact path={MENU_ITEM.PAYMENT_SUCCESS.PATH} component={PaymentSuccess} />

                <PrivateRoute exact path={`${MENU_ITEM.PICK_DETAIL.PATH}:id`} component={PickDetail} />

                <PrivateRoute exact path={MENU_ITEM.ACCOUNT.PATH} component={Account} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN.PATH} component={AdminDashboard} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_SPORTS.PATH} component={AdminSports} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_TEAMS.PATH} component={AdminTeams} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_PICKS.PATH} component={AdminPicks} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_USERS.PATH} component={AdminUsers} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_PACKAGES.PATH} component={AdminPackages} />

                <PrivateRoute exact path={MENU_ITEM.ADMIN_PURCHASE_HISTORY.PATH} component={PurchaseHistory} />

                <Route component={({ location }) => <PageNotFound location={location} />} />
              </Switch>
            </div>

            <Footer />
          </>
        </Router>
      </ProvideAuth>
    </div>
  );
}

export default App;
