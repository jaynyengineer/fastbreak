'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { signOutAction } from '@/lib/actions/auth'
import { isActionSuccess } from '@/lib/action-response'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const result = await signOutAction()

      if (isActionSuccess(result)) {
        toast.success('Signed out successfully')
        router.push('/login')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to sign out')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : 'Logout'}
    </Button>
  )
}
