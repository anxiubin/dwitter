import { useState, useEffect } from "react"
import { authService, dbService } from "firebaseInstance"
import { useHistory } from "react-router"
import Dweet from "components/Dweet"

function Profile({ refreshUser, userObj }) {
	const history = useHistory()
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
	const [dweets, setDweets] = useState([])
	const onLogOutClick = () => {
		authService.signOut()
		history.push("/")
	}
	const onChange = (event) => {
		const {
			target: { value },
		} = event
		setNewDisplayName(value)
	}
	const onSubmit = async (event) => {
		event.preventDefault()
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({
				displayName: newDisplayName,
			})
			refreshUser()
		}
	}
	const getMyDweets = async () => {
		const myDweets = await dbService
			.collection("dweets")
			.where("creatorId", "==", userObj.uid)
			.orderBy("createdAt", "desc")
			.get()
		const dweetArray = myDweets.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		setDweets(dweetArray)
	}

	useEffect(() => {
		getMyDweets()
	}, [])

	return (
		<div className="container">
			<form onSubmit={onSubmit} className="profileForm">
				<input
					onChange={onChange}
					type="text"
					autoFocus
					placeholder="Display name"
					value={newDisplayName}
					className="formInput"
				/>
				<input
					type="submit"
					value="Update Profile"
					className="formBtn"
					style={{
						marginTop: 10,
					}}
				/>
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
				Log Out
			</span>
			<div className="container_dweets">
				<h1>My Dweets</h1>
				{dweets.map((dweet) => (
					<Dweet
						key={dweet.id}
						dweetObj={dweet}
						isOwner={dweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	)
}

export default Profile
