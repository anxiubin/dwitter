import React, { useState } from "react"
import { dbService, storageService } from "firebaseInstance"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

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
		<div className="dweet">
			{editing ? (
				<>
					{isOwner && (
						<>
							<form onSubmit={onSubmit} className="container dweetEdit">
								<input
									type="text"
									placeholder="Edit your dweet"
									value={newDweet}
									required
									autoFocus
									onChange={onChange}
									className="formInput"
								/>
								<input type="submit" value="Update Dweet" className="formBtn" />
							</form>
							<span onClick={toggleEditing} className="formBtn cancelBtn">
								Cancel
							</span>
						</>
					)}
				</>
			) : (
				<>
					<h4>{dweetObj.text}</h4>
					{dweetObj.thumbnailUrl && (
						<img src={dweetObj.thumbnailUrl} alt="dweet" />
					)}
					{isOwner && (
						<div className="dweet__actions">
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</span>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default Dweet
