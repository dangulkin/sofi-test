import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getUserInfo, type UserInfo } from '@/api/user'

export function useUserInfo() {
  const user: Ref<UserInfo | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUser = async () => {
    loading.value = true
    try {
      user.value = await getUserInfo()
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchUser)

  return {
    user,
    loading,
    error,
    refresh: fetchUser,
  }
}
