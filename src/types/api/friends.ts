export type SentInvitation = {
  id: number;
  receiver: {
    username: string;
    avatar: string | null;
  };
};

export type ReceivedInvitation = {
  id: number;
  sender: {
    username: string;
    avatar: string | null;
  };
};

export type Friend = {
  username: string;
  avatar: string | null;
};

export type GetInvitationsResponse = {
  sent: SentInvitation[];
  received: ReceivedInvitation[];
};

export type GetFriendsResponse = { friends: Friend[] };
