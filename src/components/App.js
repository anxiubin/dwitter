import { useState, useEffect } from "react"
import Router from "./Router"
import { authService } from "firebaseInstance"

function App() {
	const [init, setInit] = useState(false)
	const [userObj, setUserObj] = useState(null)
	useEffect(() => {
		//App이 Firebase보다 빠르게 로드되기 때문에 Firebase가 로드되고 auth 상태를 감지하게 됐을 때 state를 변경해야한다.
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj(user)
			}
			setInit(true)
		})
	}, [])

	return (
		<>
			{init ? (
				<Router isLoggedIn={Boolean(userObj)} userObj={userObj} />
			) : (
				"Initializing..."
			)}
		</>
	)
}

export default App
