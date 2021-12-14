import Layout from "./components/UI/Layout/Layout";
import {Redirect, Route, Switch} from "react-router-dom";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import {useSelector} from "react-redux";
import MainPage from "./containers/MainPage/MainPage";
import Subscribe from "./containers/Subscribe/Subscribe";

const App = () => {
  const user = useSelector(state => state.users.user);

  const ProtectedRoute = ({isAllowed, redirectTo, ...props}) => {
    return isAllowed ?
      <Route {...props}/> :
      <Redirect to={redirectTo}/>
  };

  return (
    <Layout>
      <Switch>
        <ProtectedRoute
          path="/"
          exact
          component={MainPage}
          isAllowed={user}
          redirectTo="/login"
        />
        <ProtectedRoute
            path="/subscribe"
            exact
            component={Subscribe}
            isAllowed={user}
            redirectTo="/login"
        />
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
      </Switch>
    </Layout>
  );
};

export default App;
