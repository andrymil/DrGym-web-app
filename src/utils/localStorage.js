const getUsername = () => {
  const username =
    typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  return username;
};

const getAvatar = () => {
  const avatar =
    typeof window !== 'undefined' ? localStorage.getItem('avatar') : null;

  return avatar;
};

const removeUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
  }
};

export { getUsername, getAvatar, removeUserData };
