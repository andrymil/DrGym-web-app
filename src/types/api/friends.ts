export type Invitation = {
  id: number;
  sender: string;
  avatar: string;
};

export type Friend = {
  username: string;
  avatar: string;
};

export type FriendsInfo = {
  friends: Friend[];
  invitations: Invitation[];
};
