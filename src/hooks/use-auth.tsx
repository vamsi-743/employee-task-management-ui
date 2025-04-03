export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || "null")
  const setUser = (user: any) => {
    localStorage.setItem('user', JSON.stringify(user))
  }
  const removeUser = () => {
    localStorage.removeItem('user')
  }
  return { user, setUser, removeUser }
}

export const useEmsAuth = () => {
  const user = JSON.parse(localStorage.getItem('ems_user') || "null")
  const setUser = (user: any) => {
    localStorage.setItem('ems_user', JSON.stringify(user))
  }
  const removeUser = () => {
    localStorage.removeItem('ems_user')
  }
  return { user, setUser, removeUser }
}
