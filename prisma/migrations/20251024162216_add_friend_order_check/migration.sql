ALTER TABLE "friendships"
  ADD CONSTRAINT "friend_pair_order_check"
  CHECK ("friend1_username" < "friend2_username");