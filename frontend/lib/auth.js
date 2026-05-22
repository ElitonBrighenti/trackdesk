export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('trackdesk_user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch (err) {
    return null;
  }
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('trackdesk_user');
    window.location.href = '/login';
  }
};
