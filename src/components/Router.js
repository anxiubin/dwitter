import { HashRouter, Route, Switch } from "react-router-dom"
import Auth from "routes/Auth"
import Home from "routes/Home"
import Profile from "routes/Profile"

const Router = ({ isLoggedIn, userObj }) => {
	return (
		<HashRouter>
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path="/">
							<Home userObj={userObj} />
						</Route>
						<Route exact path="/profile">
							<Profile />
						</Route>
					</>
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
