-- CreateTable
CREATE TABLE "activities" (
    "activity_id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "reps" INTEGER DEFAULT 0,
    "weight" INTEGER DEFAULT 0,
    "duration" interval DEFAULT '00:00:00'::interval,
    "workout_id" INTEGER NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "exercise_id" SERIAL NOT NULL,
    "type" CHAR(1) DEFAULT 'S',
    "kcal_burned" INTEGER DEFAULT 0,
    "name" VARCHAR(40) NOT NULL,
    "video_id" VARCHAR(11),

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("exercise_id")
);

-- CreateTable
CREATE TABLE "exercises_muscles" (
    "id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "muscle_id" INTEGER NOT NULL,

    CONSTRAINT "exercises_muscles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendship_invitations" (
    "id" SERIAL NOT NULL,
    "who_send_username" VARCHAR(50) NOT NULL,
    "who_receive_username" VARCHAR(50) NOT NULL,
    "send_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendship_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" SERIAL NOT NULL,
    "friend1_username" VARCHAR(50) NOT NULL,
    "friend2_username" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscles" (
    "muscle_id" INTEGER NOT NULL,
    "muscle_name" VARCHAR(40) NOT NULL,

    CONSTRAINT "muscles_pkey" PRIMARY KEY ("muscle_id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "post_comment_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_username" VARCHAR(50) NOT NULL,
    "content" VARCHAR(255),
    "post_comment_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("post_comment_id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "post_reaction_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_username" VARCHAR(40) NOT NULL,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("post_reaction_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" SERIAL NOT NULL,
    "author_username" VARCHAR(50) NOT NULL,
    "post_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(100) NOT NULL,
    "workout_id" INTEGER,
    "content" VARCHAR(200),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "token" (
    "email" VARCHAR(255) NOT NULL,
    "verification_token" VARCHAR(255),
    "reset_token" VARCHAR(255),
    "reset_expiry" TIMESTAMP(6),

    CONSTRAINT "token_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "weight" DECIMAL(5,2),
    "height" DECIMAL(5,2),
    "verified" INTEGER DEFAULT 0,
    "favorite_exercise" INTEGER,
    "avatar" VARCHAR(7),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "workouts" (
    "workout_id" SERIAL NOT NULL,
    "start_datetime" TIMESTAMP(6),
    "username" VARCHAR(50) NOT NULL,
    "end_datetime" TIMESTAMP(6),
    "description" VARCHAR(255),
    "created_datetime" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_posted" INTEGER DEFAULT 0,
    "schedule" INTEGER DEFAULT 0,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("workout_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_friendship_invitation" ON "friendship_invitations"("who_send_username", "who_receive_username");

-- CreateIndex
CREATE UNIQUE INDEX "friendship_unique_pair1" ON "friendships"("friend1_username", "friend2_username");

-- CreateIndex
CREATE UNIQUE INDEX "unique_reaction_author" ON "post_reactions"("post_id", "author_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "fk_exercise" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("exercise_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "fk_workout" FOREIGN KEY ("workout_id") REFERENCES "workouts"("workout_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercises_muscles" ADD CONSTRAINT "exercise_fk" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("exercise_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercises_muscles" ADD CONSTRAINT "muscle_fk" FOREIGN KEY ("muscle_id") REFERENCES "muscles"("muscle_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendship_invitations" ADD CONSTRAINT "fk_who_receive" FOREIGN KEY ("who_receive_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendship_invitations" ADD CONSTRAINT "fk_who_send" FOREIGN KEY ("who_send_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "fk_user1" FOREIGN KEY ("friend1_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "fk_user2" FOREIGN KEY ("friend2_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "fk_author_username" FOREIGN KEY ("author_username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "fk_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "fk_reaction_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "fk_reactor_username" FOREIGN KEY ("author_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_username" FOREIGN KEY ("author_username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_workout_id" FOREIGN KEY ("workout_id") REFERENCES "workouts"("workout_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "email_fk" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "fk_workouts_username" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION;
