export async function fetcher<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    (error as Error & { status?: number; statusText?: string; data?: unknown }).status = response.status;
    (error as Error & { status?: number; statusText?: string; data?: unknown }).statusText = response.statusText;
    
    try {
      const errorData = await response.json();
      (error as Error & { status?: number; statusText?: string; data?: unknown }).data = errorData;
    } catch {
      // If we can't parse the error response, that's fine
    }
    
    throw error;
  }

  return response.json();
}

export async function fetcherWithAuth<T = unknown>(
  url: string, 
  token: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    (error as Error & { status?: number; statusText?: string; data?: unknown }).status = response.status;
    (error as Error & { status?: number; statusText?: string; data?: unknown }).statusText = response.statusText;
    
    try {
      const errorData = await response.json();
      (error as Error & { status?: number; statusText?: string; data?: unknown }).data = errorData;
    } catch {
      // If we can't parse the error response, that's fine
    }
    
    throw error;
  }

  return response.json();
} 