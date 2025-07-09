import { useMutation } from '@tanstack/react-query';

export function useRegister() {
  return useMutation({
    mutationFn: async (formData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      return data;
    },
  });
} 