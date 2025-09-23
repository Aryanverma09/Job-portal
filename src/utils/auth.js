export function getToken(){
  try{
    return localStorage.getItem('token') || ''
  }catch{
    return ''
  }
}

export function decodeJwt(token){
  try{
    const parts = token.split('.')
    if(parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')))
    return payload
  }catch{
    return null
  }
}

export function getCurrentUser(){
  const token = getToken()
  if(!token) return null
  return decodeJwt(token)
}

export function hasAnyRole(roles){
  const user = getCurrentUser()
  if(!user) return false
  return roles.includes(user.role)
}

export function logout(){
  try{
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }catch{}
}



