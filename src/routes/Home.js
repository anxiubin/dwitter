import React, { useState, useEffect, useRef } from "react"
import { dbService, storageService } from "firebaseInstance"
import { v4 as uuidv4 } from "uuid"
import Dweet from "components/Dweet"

function Home({ userObj }) {
	const [dweet, setDweet] = useState("")
	const [dweets, setDweets] = useState([])
	const [thumbnail, setThumbnail] = useState("")

	useEffect(() => {
		//onSnapshot: collection에 변화가 감지될 때마다 실행해서 dweets를 가져온다.
		dbService.collection("dweets").onSnapshot((snapshot) => {
			const dweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			setDweets(dweetArray)
		})
	}, [])

	const fileInputRef = useRef()

	const onSubmit = async (event) => {
		event.preventDefault()
		let thumbnailUrl = ""
		if (thumbnail !== "") {
			const thumbnailRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}}`)
			const response = await thumbnailRef.putString(thumbnail, "data_url")
			thumbnailUrl = await response.ref.getDownloadURL()
		}
		const dweetObj = {
			text: dweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			thumbnailUrl,
		}
		await dbService.collection("dweets").add(dweetObj)
		setDweet("")
		setThumbnail("")
		fileInputRef.current.value = null
	}
	const onChange = (event) => {
		const {
			target: { value },
		} = event
		setDweet(value)
	}
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event
		const selectedFile = files[0]
		const reader = new FileReader()
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent
			setThumbnail(result)
		}
		if (Boolean(selectedFile)) {
			reader.readAsDataURL(selectedFile)
		}
	}
	const onClearThumbnail = () => {
		setThumbnail("")
		fileInputRef.current.value = null
	}

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					value={dweet}
					onChange={onChange}
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
				/>
				<input
					type="file"
					accept="image/*"
					onChange={onFileChange}
					ref={fileInputRef}
				/>
				<input type="submit" value="Dweet" />
				{thumbnail && (
					<div>
						<img src={thumbnail} width="50px" height="50px" alt="thumbnail" />
						<button onClick={onClearThumbnail}>clear</button>
					</div>
				)}
			</form>
			<div>
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
