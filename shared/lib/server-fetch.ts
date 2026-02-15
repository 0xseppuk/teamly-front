import 'server-only';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3003/api';

/**
 * Server-side fetch utility with automatic cookie forwarding
 * Should only be used in Server Components and Server Actions
 */
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const url = `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        ...options.headers,
      },
      credentials: 'include',
      // Add cache control based on environment
      cache: options.cache || 'no-store', // Default to no-store for dynamic data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Unknown error',
      }));

      throw new ServerFetchError(
        response.status,
        errorData.message || `HTTP ${response.status}`,
        errorData,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ServerFetchError) {
      throw error;
    }

    // Network or parsing error
    throw new ServerFetchError(
      500,
      error instanceof Error ? error.message : 'Network error',
    );
  }
}

/**
 * Custom error class for server fetch operations
 */
export class ServerFetchError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ServerFetchError';
  }
}

/**
 * Type-safe query params builder
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}
