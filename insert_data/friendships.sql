--- INSERTING into FRIENDSHIPS

   SET DEFINE OFF;
insert into friendships (
   id,
   friend1_username,
   friend2_username,
   created_at
) values ( '60',
           'milosz',
           'skuter',
           to_timestamp('25/01/16 19:13:12,521963000',
                        'RR/MM/DD HH24:MI:SSXFF') );
insert into friendships (
   id,
   friend1_username,
   friend2_username,
   created_at
) values ( '51',
           'pedziwiatr',
           'milosz',
           to_timestamp('25/01/16 14:24:40,000000000',
                        'RR/MM/DD HH24:MI:SSXFF') );