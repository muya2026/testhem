-- Fresh testhem schema: seven cross-device games and the opt-in public mark wall.
-- Run this complete file once in a new Supabase project SQL Editor.
-- Names, room codes, answers, and marks use testhem_* objects; there are no legacy aliases.

create table if not exists public.testhem_rooms (
  code text primary key check (code ~ '^[A-F0-9]{6}$'),
  room_key uuid not null,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.testhem_rooms enable row level security;
revoke all on public.testhem_rooms from anon, authenticated;

create or replace function public.testhem_view(p_state jsonb, p_player_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_stage text := p_state->>'stage';
  v_type text := coalesce(p_state->>'gameType','psych');
  v_out jsonb := p_state - 'submissions' - 'votes';
  v_subs jsonb := coalesce(p_state->'submissions','[]'::jsonb);
  v_votes jsonb := coalesce(p_state->'votes','[]'::jsonb);
  v_active int := 0;
  v_own int := 0;
  v_expected int := 0;
  v_player_expected int := 0;
  v_my_expected int := 0;
  v_my_votes jsonb := '[]'::jsonb;
  v_own_ids jsonb := '[]'::jsonb;
  v_anon_subs jsonb := '[]'::jsonb;
  v_player jsonb;
begin
  v_out := v_out || jsonb_build_object('gameType',v_type,'submissionCount',jsonb_array_length(v_subs),'voteCount',jsonb_array_length(v_votes));
  if v_stage='answer' then
    v_out := v_out || jsonb_build_object('mySubmitted',exists(select 1 from jsonb_array_elements(v_subs) s where s->>'player_id'=p_player_id::text));
  elsif v_stage='vote' then
    select count(*) into v_active from jsonb_array_elements(v_subs) s where not coalesce((s->>'is_pass')::boolean,false);
    for v_player in select value from jsonb_array_elements(coalesce(p_state->'players','[]'::jsonb)) loop
      select count(*) into v_own from jsonb_array_elements(v_subs) s where s->>'player_id'=v_player->>'id' and not coalesce((s->>'is_pass')::boolean,false);
      if v_type='readRoom' then v_player_expected:=case when v_active>0 then 1 else 0 end;
      elsif v_type='questionJar' then v_player_expected:=case when v_active-v_own>0 then 1 else 0 end;
      else v_player_expected:=greatest(v_active-v_own,0); end if;
      v_expected:=v_expected+v_player_expected;
      if v_player->>'id'=p_player_id::text then v_my_expected:=v_player_expected; end if;
    end loop;
    select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'id',s->>'id','text',s->>'text','choice',s->>'choice','items',s->'items','question',s->>'question'
    )) order by s->>'id'),'[]'::jsonb)
      into v_anon_subs from jsonb_array_elements(v_subs) s
      where not coalesce((s->>'is_pass')::boolean,false) and s->>'player_id'<>p_player_id::text;
    select coalesce(jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
      'submission_id',v->>'submission_id','guess_truth',v->'guess_truth','guess_index',v->'guess_index',
      'guess_choice',v->>'guess_choice','guess_player_id',v->>'guess_player_id','guess_majority',v->>'guess_majority'
    ))),'[]'::jsonb)
      into v_my_votes from jsonb_array_elements(v_votes) v where v->>'voter_id'=p_player_id::text;
    select coalesce(jsonb_agg(s->>'id'),'[]'::jsonb)
      into v_own_ids from jsonb_array_elements(v_subs) s where s->>'player_id'=p_player_id::text;
    v_out:=v_out||jsonb_build_object('submissions',v_anon_subs,'myVotes',v_my_votes,'ownSubmissionIds',v_own_ids,'myExpectedVotes',v_my_expected,'expectedVotes',v_expected);
  elsif v_stage='reveal' then
    v_out:=v_out||jsonb_build_object('submissions',v_subs,'votes',v_votes);
  end if;
  return v_out;
end;
$$;

create or replace function public.testhem_create_room(p_host_id uuid, p_host_name text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_code text;
  v_key uuid := gen_random_uuid();
  v_state jsonb;
begin
  delete from public.testhem_rooms where created_at < now() - interval '7 days';
  if length(trim(p_host_name)) < 1 or length(p_host_name) > 18 then raise exception 'Choose a name up to 18 characters.'; end if;
  loop
    v_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
    exit when not exists(select 1 from public.testhem_rooms where code = v_code);
  end loop;
  v_state := jsonb_build_object('roomCode',v_code,'hostId',p_host_id::text,'stage','lobby','round',0,'deck','odd','prompt',null,'players',jsonb_build_array(jsonb_build_object('id',p_host_id::text,'name',trim(p_host_name),'score',0)),'submissions','[]'::jsonb,'votes','[]'::jsonb);
  insert into public.testhem_rooms(code,room_key,state) values(v_code,v_key,v_state);
  return jsonb_build_object('code',v_code,'key',v_key::text,'state',public.testhem_view(v_state,p_host_id));
end;
$$;

create or replace function public.testhem_join_room(p_code text, p_room_key uuid, p_player_id uuid, p_player_name text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_room_key uuid;
  v_state jsonb;
  v_players jsonb;
begin
  select room_key,state into v_room_key,v_state from public.testhem_rooms where code=upper(p_code) for update;
  if not found or v_room_key <> p_room_key then raise exception 'That private invite is invalid or expired.'; end if;
  if length(trim(p_player_name)) < 1 or length(p_player_name) > 18 then raise exception 'Choose a name up to 18 characters.'; end if;
  v_players := coalesce(v_state->'players','[]'::jsonb);
  if exists(select 1 from jsonb_array_elements(v_players) p where p->>'id'=p_player_id::text) then
    return public.testhem_view(v_state,p_player_id);
  end if;
  if v_state->>'stage' <> 'lobby' then raise exception 'This room has already started.'; end if;
  if jsonb_array_length(v_players) >= 8 then raise exception 'This room is full (8 players maximum).'; end if;
  if exists(select 1 from jsonb_array_elements(v_players) p where lower(p->>'name')=lower(trim(p_player_name))) then raise exception 'That name is already in the room.'; end if;
  v_players := v_players || jsonb_build_array(jsonb_build_object('id',p_player_id::text,'name',trim(p_player_name),'score',0));
  v_state := jsonb_set(v_state,'{players}',v_players);
  update public.testhem_rooms set state=v_state,updated_at=now() where code=upper(p_code);
  return public.testhem_view(v_state,p_player_id);
end;
$$;

create or replace function public.testhem_get_room(p_code text, p_room_key uuid, p_player_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_room_key uuid;
  v_state jsonb;
begin
  select room_key,state into v_room_key,v_state from public.testhem_rooms where code=upper(p_code);
  if not found or v_room_key <> p_room_key then raise exception 'Room not found. Check the full invite link.'; end if;
  if not exists(select 1 from jsonb_array_elements(coalesce(v_state->'players','[]'::jsonb)) p where p->>'id'=p_player_id::text) then raise exception 'You are not a player in this room.'; end if;
  return public.testhem_view(v_state,p_player_id);
end;
$$;

create or replace function public.testhem_set_room_game(p_code text,p_room_key uuid,p_player_id uuid,p_game_type text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  v_state jsonb;
  v_room_key uuid;
begin
  if p_game_type not in ('psych','twoTruths','wyr','threeQ','questionJar','hiddenTruth','readRoom') then raise exception 'Unknown game mode.'; end if;
  select room_key,state into v_room_key,v_state from public.testhem_rooms where code=upper(p_code) for update;
  if not found or v_room_key<>p_room_key then raise exception 'Room not found. Check the private invite link.'; end if;
  if v_state->>'hostId'<>p_player_id::text then raise exception 'Only the host can choose the game.'; end if;
  if v_state->>'stage'<>'lobby' then raise exception 'The game can only be changed in the lobby.'; end if;
  v_state:=jsonb_set(v_state,'{gameType}',to_jsonb(p_game_type),true);
  update public.testhem_rooms set state=v_state,updated_at=now() where code=upper(p_code);
  return public.testhem_view(v_state,p_player_id);
end;
$$;

create or replace function public.testhem_game_action(p_code text,p_room_key uuid,p_player_id uuid,p_action text,p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
  r public.testhem_rooms%rowtype;
  v_state jsonb;
  v_players jsonb;
  v_subs jsonb;
  v_votes jsonb;
  v_item jsonb;
  v_sub jsonb;
  v_vote jsonb;
  v_votes_in jsonb;
  v_points jsonb:='{}'::jsonb;
  v_updated_players jsonb:='[]'::jsonb;
  v_type text;
  v_choice text;
  v_player_id text;
  v_prompt jsonb;
  v_expected int:=0;
  v_player_expected int:=0;
  v_active int:=0;
  v_own int:=0;
  v_count int:=0;
  v_max int:=0;
  v_a int:=0;
  v_b int:=0;
  v_majority text;
  v_truth boolean;
  v_correct boolean;
  v_score int;
  v_index int;
begin
  select * into r from public.testhem_rooms where code=upper(p_code) for update;
  if not found or r.room_key<>p_room_key then raise exception 'Room not found. Check the private invite link.'; end if;
  v_state:=r.state;v_players:=coalesce(v_state->'players','[]'::jsonb);v_subs:=coalesce(v_state->'submissions','[]'::jsonb);v_votes:=coalesce(v_state->'votes','[]'::jsonb);v_type:=coalesce(v_state->>'gameType','psych');
  if not exists(select 1 from jsonb_array_elements(v_players) p where p->>'id'=p_player_id::text) then raise exception 'You are not a player in this room.'; end if;

  if p_action='start' then
    if v_state->>'hostId'<>p_player_id::text then raise exception 'Only the host can start the next round.'; end if;
    if v_state->>'stage' not in ('lobby','reveal') then raise exception 'This round is already in progress.'; end if;
    if v_state->>'stage'='lobby' and jsonb_array_length(v_players)<2 then raise exception 'Invite at least one friend before starting.'; end if;
    v_prompt:=p_data->'prompt';
    if jsonb_typeof(v_prompt)<>'array' then raise exception 'A valid prompt is required.'; end if;
    if (v_type in ('wyr','readRoom') and jsonb_array_length(v_prompt)<>5) or (v_type not in ('wyr','readRoom') and jsonb_array_length(v_prompt)<>3) then raise exception 'The prompt does not match the selected game.'; end if;
    if v_type='threeQ' and (jsonb_typeof(p_data->'questionSet')<>'array' or jsonb_array_length(p_data->'questionSet')<>3) then raise exception 'Three Questions needs exactly three questions.'; end if;

    if v_state->>'stage'='reveal' then
      for v_item in select value from jsonb_array_elements(v_players) loop v_points:=v_points||jsonb_build_object(v_item->>'id',0); end loop;
      if v_type='psych' then
        for v_item in select value from jsonb_array_elements(v_votes) loop
          select value into v_sub from jsonb_array_elements(v_subs) where value->>'id'=v_item->>'submission_id' limit 1;
          if v_sub is null then continue; end if;
          v_truth:=coalesce((v_sub->>'is_truth')::boolean,false);v_correct:=coalesce((v_item->>'guess_truth')::boolean,false)=v_truth;
          if v_correct then v_player_id:=v_item->>'voter_id';v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);end if;
          if not v_truth and coalesce((v_item->>'guess_truth')::boolean,false) then v_player_id:=v_sub->>'player_id';v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);end if;
        end loop;
      elsif v_type in ('twoTruths','threeQ') then
        for v_item in select value from jsonb_array_elements(v_votes) loop
          select value into v_sub from jsonb_array_elements(v_subs) where value->>'id'=v_item->>'submission_id' limit 1;
          if v_sub is null then continue;end if;
          if coalesce((v_item->>'guess_index')::int,-1)=coalesce((v_sub->>'lie_index')::int,-2) then v_player_id:=v_item->>'voter_id';else v_player_id:=v_sub->>'player_id';end if;
          v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);
        end loop;
      elsif v_type='wyr' then
        for v_item in select value from jsonb_array_elements(v_votes) loop
          select value into v_sub from jsonb_array_elements(v_subs) where value->>'id'=v_item->>'submission_id' limit 1;
          if v_sub is not null and v_item->>'guess_choice'=v_sub->>'choice' then v_player_id:=v_item->>'voter_id';v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);end if;
        end loop;
      elsif v_type='hiddenTruth' then
        for v_item in select value from jsonb_array_elements(v_votes) loop
          select value into v_sub from jsonb_array_elements(v_subs) where value->>'id'=v_item->>'submission_id' limit 1;
          if v_sub is null then continue;end if;
          if v_item->>'guess_player_id'=v_sub->>'player_id' then v_player_id:=v_item->>'voter_id';else v_player_id:=v_sub->>'player_id';end if;
          v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);
        end loop;
      elsif v_type='readRoom' then
        select count(*) into v_a from jsonb_array_elements(v_subs) s where s->>'choice'='A' and not coalesce((s->>'is_pass')::boolean,false);
        select count(*) into v_b from jsonb_array_elements(v_subs) s where s->>'choice'='B' and not coalesce((s->>'is_pass')::boolean,false);
        v_majority:=case when v_a=v_b then null when v_a>v_b then 'A' else 'B' end;
        if v_majority is not null then for v_item in select value from jsonb_array_elements(v_votes) loop if v_item->>'guess_majority'=v_majority then v_player_id:=v_item->>'voter_id';v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+1),true);end if;end loop;end if;
      elsif v_type='questionJar' then
        select coalesce(max(n),0) into v_max from (select count(*) n from jsonb_array_elements(v_votes) group by value->>'submission_id') counts;
        if v_max>0 then for v_sub in select value from jsonb_array_elements(v_subs) loop select count(*) into v_count from jsonb_array_elements(v_votes) where value->>'submission_id'=v_sub->>'id';if v_count=v_max and not coalesce((v_sub->>'is_pass')::boolean,false) then v_player_id:=v_sub->>'player_id';v_points:=jsonb_set(v_points,array[v_player_id],to_jsonb(coalesce((v_points->>v_player_id)::int,0)+2),true);end if;end loop;end if;
      end if;
      v_updated_players:='[]'::jsonb;
      for v_item in select value from jsonb_array_elements(v_players) loop v_player_id:=v_item->>'id';v_score:=coalesce((v_item->>'score')::int,0)+coalesce((v_points->>v_player_id)::int,0);v_updated_players:=v_updated_players||jsonb_build_array(jsonb_set(v_item,'{score}',to_jsonb(v_score),true));end loop;
      v_players:=v_updated_players;v_state:=jsonb_set(v_state,'{players}',v_players,true);
    end if;
    v_state:=jsonb_set(v_state,'{stage}','"answer"'::jsonb,true);
    v_state:=jsonb_set(v_state,'{round}',to_jsonb(coalesce((v_state->>'round')::int,0)+1),true);
    v_state:=jsonb_set(v_state,'{deck}',coalesce(p_data->'deck','"odd"'::jsonb),true);
    v_state:=jsonb_set(v_state,'{prompt}',v_prompt,true);
    v_state:=jsonb_set(v_state,'{questionSet}',coalesce(p_data->'questionSet','null'::jsonb),true);
    v_state:=jsonb_set(v_state,'{submissions}','[]'::jsonb,true);v_state:=jsonb_set(v_state,'{votes}','[]'::jsonb,true);

  elsif p_action='submit' then
    if v_state->>'stage'<>'answer' then raise exception 'Answers are closed.';end if;
    if exists(select 1 from jsonb_array_elements(v_subs) s where s->>'player_id'=p_player_id::text) then raise exception 'Your answer is already sealed.';end if;
    v_sub:=jsonb_build_object('id',gen_random_uuid()::text,'player_id',p_player_id::text,'is_pass',coalesce((p_data->>'is_pass')::boolean,false));
    if not coalesce((p_data->>'is_pass')::boolean,false) then
      if v_type='psych' then
        if length(trim(coalesce(p_data->>'text','')))<3 or length(p_data->>'text')>180 then raise exception 'Write at least 3 characters (up to 180), or pass.';end if;
        v_sub:=v_sub||jsonb_build_object('text',trim(p_data->>'text'),'is_truth',coalesce((p_data->>'is_truth')::boolean,false));
      elsif v_type in ('twoTruths','threeQ') then
        if jsonb_typeof(p_data->'items')<>'array' or jsonb_array_length(p_data->'items')<>3 or exists(select 1 from jsonb_array_elements_text(p_data->'items') x where length(trim(x))<2 or length(x)>150) then raise exception 'Enter three short lines.';end if;
        v_index:=coalesce((p_data->>'lie_index')::int,-1);if v_index<0 or v_index>2 then raise exception 'Mark which line is the lie.';end if;
        v_sub:=v_sub||jsonb_build_object('items',p_data->'items','lie_index',v_index);
      elsif v_type='wyr' then
        if p_data->>'choice' not in ('A','B') or length(trim(coalesce(p_data->>'text','')))<2 or length(p_data->>'text')>120 then raise exception 'Choose A or B and give a short reason.';end if;
        v_sub:=v_sub||jsonb_build_object('choice',p_data->>'choice','text',trim(p_data->>'text'));
      elsif v_type='readRoom' then
        if coalesce(p_data->>'choice','') not in ('A','B') then raise exception 'Choose A or B.';end if;v_sub:=v_sub||jsonb_build_object('choice',p_data->>'choice');
      elsif v_type='hiddenTruth' then
        if length(trim(coalesce(p_data->>'text','')))<4 or length(p_data->>'text')>150 then raise exception 'Write one harmless short fact, or pass.';end if;v_sub:=v_sub||jsonb_build_object('text',trim(p_data->>'text'));
      elsif v_type='questionJar' then
        if length(trim(coalesce(p_data->>'question','')))<3 or length(trim(coalesce(p_data->>'text','')))<2 or length(p_data->>'text')>180 then raise exception 'Add your drawn question and a short answer, or pass.';end if;
        v_sub:=v_sub||jsonb_build_object('question',trim(p_data->>'question'),'text',trim(p_data->>'text'));
      end if;
    end if;
    v_subs:=v_subs||jsonb_build_array(v_sub);v_state:=jsonb_set(v_state,'{submissions}',v_subs,true);
    if jsonb_array_length(v_subs)>=jsonb_array_length(v_players) then
      select count(*) into v_active from jsonb_array_elements(v_subs) s where not coalesce((s->>'is_pass')::boolean,false);
      v_expected:=0;
      for v_item in select value from jsonb_array_elements(v_players) loop
        select count(*) into v_own from jsonb_array_elements(v_subs) s where s->>'player_id'=v_item->>'id' and not coalesce((s->>'is_pass')::boolean,false);
        if v_type='readRoom' then v_player_expected:=case when v_active>0 then 1 else 0 end;
        elsif v_type='questionJar' then v_player_expected:=case when v_active-v_own>0 then 1 else 0 end;
        else v_player_expected:=greatest(v_active-v_own,0);end if;
        v_expected:=v_expected+v_player_expected;
      end loop;
      if v_expected=0 then v_state:=jsonb_set(v_state,'{stage}','"reveal"'::jsonb,true);else v_state:=jsonb_set(v_state,'{stage}','"vote"'::jsonb,true);end if;
    end if;

  elsif p_action='vote' then
    if v_state->>'stage'<>'vote' then raise exception 'Voting is not open.';end if;
    if exists(select 1 from jsonb_array_elements(v_votes) v where v->>'voter_id'=p_player_id::text) then raise exception 'Your ballot is already locked.';end if;
    select count(*) into v_active from jsonb_array_elements(v_subs) s where not coalesce((s->>'is_pass')::boolean,false);
    select count(*) into v_own from jsonb_array_elements(v_subs) s where s->>'player_id'=p_player_id::text and not coalesce((s->>'is_pass')::boolean,false);
    if v_type='readRoom' then
      if coalesce(p_data->>'guess_majority','') not in ('A','B') then raise exception 'Predict A or B.';end if;
      v_votes:=v_votes||jsonb_build_array(jsonb_build_object('voter_id',p_player_id::text,'guess_majority',p_data->>'guess_majority'));
    elsif v_type='questionJar' then
      if v_active-v_own<1 then raise exception 'There is no other active answer to vote for.';end if;
      if not exists(select 1 from jsonb_array_elements(v_subs) s where s->>'id'=p_data->>'submission_id' and s->>'player_id'<>p_player_id::text and not coalesce((s->>'is_pass')::boolean,false)) then raise exception 'Choose another player’s answer.';end if;
      v_votes:=v_votes||jsonb_build_array(jsonb_build_object('voter_id',p_player_id::text,'submission_id',p_data->>'submission_id'));
    else
      v_expected:=greatest(v_active-v_own,0);v_votes_in:=coalesce(p_data->'votes','[]'::jsonb);
      if jsonb_typeof(v_votes_in)<>'array' or jsonb_array_length(v_votes_in)<>v_expected then raise exception 'Vote on each eligible answer once.';end if;
      for v_vote in select value from jsonb_array_elements(v_votes_in) loop
        select value into v_sub from jsonb_array_elements(v_subs) where value->>'id'=v_vote->>'submission_id' and not coalesce((value->>'is_pass')::boolean,false) and value->>'player_id'<>p_player_id::text limit 1;
        if v_sub is null then raise exception 'A vote refers to an unavailable answer.';end if;
        if exists(select 1 from jsonb_array_elements(v_votes_in) x where x->>'submission_id'=v_vote->>'submission_id' group by x->>'submission_id' having count(*)>1) then raise exception 'Duplicate answer vote.';end if;
        if v_type='psych' then
          if not (v_vote ? 'guess_truth') then raise exception 'Each answer needs a truth-or-bluff guess.';end if;
          v_item:=jsonb_build_object('voter_id',p_player_id::text,'submission_id',v_vote->>'submission_id','guess_truth',(v_vote->>'guess_truth')::boolean);
        elsif v_type in ('twoTruths','threeQ') then
          v_index:=coalesce((v_vote->>'guess_index')::int,-1);if v_index<0 or v_index>2 then raise exception 'Choose one of the three lines.';end if;
          v_item:=jsonb_build_object('voter_id',p_player_id::text,'submission_id',v_vote->>'submission_id','guess_index',v_index);
        elsif v_type='wyr' then
          if coalesce(v_vote->>'guess_choice','') not in ('A','B') then raise exception 'Predict A or B for every player.';end if;
          v_item:=jsonb_build_object('voter_id',p_player_id::text,'submission_id',v_vote->>'submission_id','guess_choice',v_vote->>'guess_choice');
        elsif v_type='hiddenTruth' then
          if not exists(select 1 from jsonb_array_elements(v_players) pl where pl->>'id'=v_vote->>'guess_player_id' and pl->>'id'<>p_player_id::text) then raise exception 'Choose another player as the author.';end if;
          v_item:=jsonb_build_object('voter_id',p_player_id::text,'submission_id',v_vote->>'submission_id','guess_player_id',v_vote->>'guess_player_id');
        end if;
        v_votes:=v_votes||jsonb_build_array(v_item);
      end loop;
    end if;
    v_state:=jsonb_set(v_state,'{votes}',v_votes,true);
    v_expected:=0;
    if v_type='readRoom' then v_expected:=jsonb_array_length(v_players);
    elsif v_type='questionJar' then
      for v_item in select value from jsonb_array_elements(v_players) loop
        select count(*) into v_own from jsonb_array_elements(v_subs) s where s->>'player_id'=v_item->>'id' and not coalesce((s->>'is_pass')::boolean,false);
        if v_active-v_own>0 then v_expected:=v_expected+1;end if;
      end loop;
    else
      for v_item in select value from jsonb_array_elements(v_players) loop
        select count(*) into v_own from jsonb_array_elements(v_subs) s where s->>'player_id'=v_item->>'id' and not coalesce((s->>'is_pass')::boolean,false);
        v_expected:=v_expected+greatest(v_active-v_own,0);
      end loop;
    end if;
    if jsonb_array_length(v_votes)>=v_expected then v_state:=jsonb_set(v_state,'{stage}','"reveal"'::jsonb,true);end if;
  else
    raise exception 'Unknown game action.';
  end if;
  update public.testhem_rooms set state=v_state,updated_at=now() where code=r.code;
  return public.testhem_view(v_state,p_player_id);
end;
$$;

-- testhem opt-in public mark wall.
-- Installed together with the room features in this fresh-project schema.
-- Names and marks are public only after the visitor submits the form and checks consent.

create table if not exists public.testhem_marks (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 24),
  mark text not null check (char_length(btrim(mark)) between 1 and 180),
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.testhem_marks add column if not exists consented_at timestamptz not null default now();

create index if not exists testhem_marks_created_at_idx
  on public.testhem_marks (created_at desc);
create index if not exists testhem_marks_visitor_created_at_idx
  on public.testhem_marks (visitor_id, created_at desc);

alter table public.testhem_marks enable row level security;
revoke all on public.testhem_marks from public, anon, authenticated;

create or replace function public.testhem_get_marks(p_limit integer default 40)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'marks', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', recent.id,
          'display_name', recent.display_name,
          'mark', recent.mark,
          'created_at', recent.created_at
        ) order by recent.created_at desc
      ),
      '[]'::jsonb
    )
  )
  from (
    select id, display_name, mark, created_at
    from public.testhem_marks
    order by created_at desc
    limit least(greatest(coalesce(p_limit, 40), 1), 60)
  ) as recent;
$$;

drop function if exists public.testhem_leave_mark(uuid, text, text, text);

create or replace function public.testhem_leave_mark(
  p_visitor_id uuid,
  p_display_name text,
  p_mark text,
  p_consent boolean,
  p_website text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(regexp_replace(coalesce(p_display_name, ''), '[[:cntrl:]]', ' ', 'g'));
  v_mark text := btrim(regexp_replace(coalesce(p_mark, ''), '[[:cntrl:]]', ' ', 'g'));
  v_recent_count integer;
  v_id uuid;
begin
  if p_consent is distinct from true then
    raise exception 'Public consent is required before a mark can be posted.';
  end if;
  -- Bot honeypot. Legitimate clients always send this as an empty string.
  if coalesce(btrim(p_website), '') <> '' then
    raise exception 'Unable to accept this mark.';
  end if;
  if p_visitor_id is null then raise exception 'Refresh the page and try again.'; end if;
  if char_length(v_name) < 1 or char_length(v_name) > 24 then
    raise exception 'Display names must be 1–24 characters.';
  end if;
  if char_length(v_mark) < 1 or char_length(v_mark) > 180 then
    raise exception 'Marks must be 1–180 characters.';
  end if;

  -- Lightweight abuse guard, not an identity system: five posts per browser token/hour.
  select count(*) into v_recent_count
  from public.testhem_marks
  where visitor_id = p_visitor_id
    and created_at > now() - interval '1 hour';
  if v_recent_count >= 5 then
    raise exception 'This browser has left its hourly limit. Please try again later.';
  end if;

  insert into public.testhem_marks(visitor_id, display_name, mark)
  values (p_visitor_id, v_name, v_mark)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

revoke all on function public.testhem_get_marks(integer) from public, anon, authenticated;
revoke all on function public.testhem_leave_mark(uuid, text, text, boolean, text) from public, anon, authenticated;
grant execute on function public.testhem_get_marks(integer) to anon, authenticated;
grant execute on function public.testhem_leave_mark(uuid, text, text, boolean, text) to anon, authenticated;

revoke all on function public.testhem_view(jsonb,uuid) from public, anon, authenticated;
revoke all on function public.testhem_create_room(uuid,text) from public, anon, authenticated;
revoke all on function public.testhem_join_room(text,uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.testhem_get_room(text,uuid,uuid) from public, anon, authenticated;
revoke all on function public.testhem_set_room_game(text,uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.testhem_game_action(text,uuid,uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.testhem_create_room(uuid,text) to anon, authenticated;
grant execute on function public.testhem_join_room(text,uuid,uuid,text) to anon, authenticated;
grant execute on function public.testhem_get_room(text,uuid,uuid) to anon, authenticated;
grant execute on function public.testhem_set_room_game(text,uuid,uuid,text) to anon, authenticated;
grant execute on function public.testhem_game_action(text,uuid,uuid,text,jsonb) to anon, authenticated;
