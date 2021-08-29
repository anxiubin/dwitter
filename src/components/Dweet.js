import React, { useState } from "react"
import { dbService, storageService } from "firebaseInstance"

const Dweet = ({ dweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false)
	const [newDweet, setNewDweet] = useState(dweetObj.text)
	const onDeleteClick = async () => {
		const ok = window.confirm("Are you sure you want to delete this dweet?")
		try {
			if (ok) {
				await dbService.doc(`dweets/${dweetObj.id}`).delete()
				if (dweetObj.thumbnailUrl !== "") {
					await storageService.refFromURL(dweetObj.thumbnailUrl).delete()
				}
			}
		} catch (e) {
			console.error(e)
		}
	}
	const toggleEditing = () => setEditing((prev) => !prev)
	const onSubmit = async (event) => {
		event.preventDefault()
		try {
			await dbService.doc(`dweets/${dweetObj.id}`).update({
				text: newDweet,
			})
			setEditing(false)
		} catch (e) {
			console.error(e)
		}
	}
	const onChange = (event) => {
		const {
			target: { value },
		} = event
		setNewDweet(value)
	}
	return (
		<div>
			{editing ? (
				<>
					{isOwner && (
						<>
							<form onSubmit={onSubmit}>
								<input
									type="text"
									placeholder="Edit your dweet"
									value={newDweet}
									required
									onChange={onChange}
								/>
								<input type="submit" value="Update Dweet" />
							</form>
							<button onClick={toggleEditing}>Cancel</button>
						</>
					)}
				</>
			) : (
				<>
					<h4>{dweetObj.text}</h4>
					{dweetObj.thumbnailUrl && (
						<img
							src={dweetObj.thumbnailUrl}
							width="50px"
							height="50px"
							alt="dweet"
						/>
					)}
					{isOwner && (
						<>
							<button onClick={onDeleteClick}>Delete Dweet</button>
							<button onClick={toggleEditing}>Edit Dweet</button>
						</>
					)}
				</>
			)}
		</div>
	)
}

export default Dweet
