import { cookies } from 'next/headers';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'EDITOR' | 'ADMIN';
  avatarUrl: string | null;
  createdAt: string;
}

/**
 * Fetch the current user on the server (Server Components / Server Actions)
 */
export async function getServerCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store', // Do not cache auth checks
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch (error) {
    console.error('Error in getServerCurrentUser:', error);
    return null;
  }
}

/**
 * Check if the user is authorized for a specific minimum role
 */
export function hasRole(userRole: 'USER' | 'EDITOR' | 'ADMIN', requiredRole: 'USER' | 'EDITOR' | 'ADMIN'): boolean {
  const roleHierarchy: Record<string, number> = {
    USER: 1,
    EDITOR: 2,
    ADMIN: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
