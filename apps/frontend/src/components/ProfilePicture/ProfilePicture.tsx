import { Nullish, Patient } from '@3dp4me/types'
import { FC, useEffect, useState } from 'react'

import { getProfilePictureUrl } from '../../utils/profilePicture'

interface ProfilePictureProps {
    patient: Patient
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ patient }) => {
    const [profilePicUrl, setProfilePicUrl] = useState<Nullish<string>>(null)

    useEffect(() => {
        const updateProfilePic = async () => {
            const url = await getProfilePictureUrl(patient)
            setProfilePicUrl(url)
        }

        updateProfilePic()
    }, [patient])

    if (!profilePicUrl) return null
    return <img id="profile-pic" src={profilePicUrl} />
}
