import React, { useState, useEffect, useCallback } from "react"
import { dbService } from "firebaseInstance"
import Dweet from "components/Dweet"
import DweetForm from "components/DweetForm"

function Home({ userObj }) {
	const [dweets, setDweets] = useState([])

	const getDweets = useCallback(() => {
		//onSnapshot: collection에 변화가 감지될 때마다 실행해서 dweets를 가져온다.
		dbService
			.collection("dweets")
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				const dweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))
				setDweets(dweetArray)
			})
	}, [])

	useEffect(() => {
		getDweets()

		return () => setDweets([])
	}, [])

	return (
		<div className="container">
			<DweetForm userObj={userObj} />
			<div style={{ marginTop: 30 }}>
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
export default Home
