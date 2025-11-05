export const userPreferencesStore = {
  username: localStorage.getItem('username') || '',

  setUsername: (username: string) => {
    userPreferencesStore.username = username;
    localStorage.setItem('username', username);
  },

  getUsername: () => {
    return userPreferencesStore.username;
  },
};

