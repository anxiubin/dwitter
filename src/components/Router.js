import { HashRouter, Route, Switch } from "react-router-dom"
import Auth from "routes/Auth"
import Home from "routes/Home"
import Profile from "routes/Profile"
import Navigation from "./Navigation"

const Router = ({ refreshUser, isLoggedIn, userObj }) => {
	return (
		<HashRouter>
			{isLoggedIn && <Navigation userObj={userObj} />}
			<Switch>
				{isLoggedIn ? (
					<div className="routerContaniner">
						<Route exact path="/">
							<Home userObj={userObj} />
						</Route>
						<Route exact path="/profile">
							<Profile userObj={userObj} refreshUser={refreshUser} />
						</Route>
					</div>
				) : (
					<Route exact path="/">
						<Auth />
					</Route>
				)}
			</Switch>
		</HashRouter>
	)
}

export default Router
