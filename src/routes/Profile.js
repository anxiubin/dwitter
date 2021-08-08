import { authService } from "firebaseInstance"
import { useHistory } from "react-router"

function Profile() {
	const history = useHistory()
	const onLogOutClick = () => {
		authService.signOut()
		history.push("/")
	}
	return <button onClick={onLogOutClick}>LogOut</button>
}

export default Profile
