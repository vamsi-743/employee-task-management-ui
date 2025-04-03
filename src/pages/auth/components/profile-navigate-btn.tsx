import { IconUserEdit } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

// ... existing code ...

const ProfileNavigateBtn = ({ employeeId }: { employeeId: string }) => {
  const navigate = useNavigate()

  return (
    <IconUserEdit
      className='cursor-pointer'
      onClick={() => navigate(`/employee-profile/${employeeId}`)}
    />
  )
}

export default ProfileNavigateBtn
