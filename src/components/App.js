import { useState, useEffect } from "react"
import Router from "./Router"
import { authService } from "firebaseInstance"

function App() {
	const [init, setInit] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

	useEffect(() => {
		//App이 Firebase보다 빠르게 로드되기 때문에 Firebase가 로드되고 auth 상태를 감지하게 됐을 때 state를 변경해야한다.
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true)
			} else {
				setIsLoggedIn(false)
			}
			setInit(true)
		})
	}, [])

	return <>{init ? <Router isLoggedIn={isLoggedIn} /> : "Initializing..."}</>
}

export default App
