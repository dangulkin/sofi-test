export interface UserInfo {
  user_id: string
  email: string
  name: string
  first_name: string
  last_name: string
  gender: string
  telegram?: string | null
  phone?: string | null
  portfolio_link?: string | null
  created_at: string
}

export async function getUserInfo() {
  const res = await fetch('/api/users/me/info', {
    credentials: 'include',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  return res.json()
}

