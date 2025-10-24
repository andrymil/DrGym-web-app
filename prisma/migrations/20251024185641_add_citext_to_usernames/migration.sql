-- Enable citext once per DB
CREATE EXTENSION IF NOT EXISTS citext;

-- 1) Drop foreign keys that point to users(username), so we can alter types
ALTER TABLE "friendship_invitations" DROP CONSTRAINT IF EXISTS "fk_who_receive";
ALTER TABLE "friendship_invitations" DROP CONSTRAINT IF EXISTS "fk_who_send";
ALTER TABLE "friendships"             DROP CONSTRAINT IF EXISTS "fk_user1";
ALTER TABLE "friendships"             DROP CONSTRAINT IF EXISTS "fk_user2";
ALTER TABLE "posts"                   DROP CONSTRAINT IF EXISTS "fk_username";
ALTER TABLE "post_comments"           DROP CONSTRAINT IF EXISTS "fk_author_username";
ALTER TABLE "post_reactions"          DROP CONSTRAINT IF EXISTS "fk_reactor_username";
ALTER TABLE "workouts"                DROP CONSTRAINT IF EXISTS "fk_workouts_username";

-- 2) Change column types to CITEXT (using explicit cast)
ALTER TABLE "users"
  ALTER COLUMN "username" TYPE citext USING "username"::citext;

ALTER TABLE "friendships"
  ALTER COLUMN "friend1_username" TYPE citext USING "friend1_username"::citext,
  ALTER COLUMN "friend2_username" TYPE citext USING "friend2_username"::citext;

ALTER TABLE "friendship_invitations"
  ALTER COLUMN "who_send_username"    TYPE citext USING "who_send_username"::citext,
  ALTER COLUMN "who_receive_username" TYPE citext USING "who_receive_username"::citext;

ALTER TABLE "posts"
  ALTER COLUMN "author_username" TYPE citext USING "author_username"::citext;

ALTER TABLE "post_comments"
  ALTER COLUMN "author_username" TYPE citext USING "author_username"::citext;

ALTER TABLE "post_reactions"
  ALTER COLUMN "author_username" TYPE citext USING "author_username"::citext;

ALTER TABLE "workouts"
  ALTER COLUMN "username" TYPE citext USING "username"::citext;

-- 3) Re-create foreign keys (names match your @relation map: "...", map: "fk_*")
ALTER TABLE "friendship_invitations"
  ADD CONSTRAINT "fk_who_receive"
  FOREIGN KEY ("who_receive_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "friendship_invitations"
  ADD CONSTRAINT "fk_who_send"
  FOREIGN KEY ("who_send_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "friendships"
  ADD CONSTRAINT "fk_user1"
  FOREIGN KEY ("friend1_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "friendships"
  ADD CONSTRAINT "fk_user2"
  FOREIGN KEY ("friend2_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "posts"
  ADD CONSTRAINT "fk_username"
  FOREIGN KEY ("author_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "post_comments"
  ADD CONSTRAINT "fk_author_username"
  FOREIGN KEY ("author_username") REFERENCES "users"("username")
  ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "post_reactions"
  ADD CONSTRAINT "fk_reactor_username"
  FOREIGN KEY ("author_username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "workouts"
  ADD CONSTRAINT "fk_workouts_username"
  FOREIGN KEY ("username") REFERENCES "users"("username")
  ON DELETE CASCADE ON UPDATE NO ACTION;

-- 4) (Re)add alphabetical order CHECK (case-insensitive)
ALTER TABLE "friendships" DROP CONSTRAINT IF EXISTS "friend_pair_order_check";
ALTER TABLE "friendships"
  ADD CONSTRAINT "friend_pair_order_check"
  CHECK (LOWER("friend1_username") < LOWER("friend2_username"));
