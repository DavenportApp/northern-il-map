create table if not exists public.map_locations (
    id uuid primary key default gen_random_uuid(),
    group_data jsonb not null check (jsonb_typeof(group_data) = 'object')
);

create table if not exists public.map_state (
    id boolean primary key default true check (id),
    version bigint not null default 0
);

insert into public.map_state (id, version)
values (true, 0)
on conflict (id) do nothing;

alter table public.map_locations enable row level security;
alter table public.map_state enable row level security;
revoke all on table public.map_locations from anon, authenticated;
revoke all on table public.map_state from anon, authenticated;
grant select, insert, delete on table public.map_locations to service_role;
grant select on table public.map_state to service_role;

create or replace function public.get_map_locations()
returns jsonb
language sql
security definer
set search_path = public
as $$
    select jsonb_build_object(
        'version', state.version,
        'locations', coalesce(
            jsonb_agg(location.group_data order by location.id)
                filter (where location.id is not null),
            '[]'::jsonb
        )
    )
    from public.map_state as state
    left join public.map_locations as location on true
    where state.id = true
    group by state.version;
$$;

create or replace function public.replace_map_locations(locations jsonb, expected_version bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    saved integer;
    current_version bigint;
begin
    if jsonb_typeof(locations) is distinct from 'array' then
        raise exception 'locations must be a JSON array';
    end if;

    select version into current_version
    from public.map_state
    where id = true
    for update;

    if expected_version is distinct from current_version then
        return jsonb_build_object('conflict', true, 'version', current_version);
    end if;

    delete from public.map_locations;

    insert into public.map_locations (group_data)
    select case
        when nullif(item ->> 'groupId', '') is null then
            jsonb_set(item, '{groupId}', to_jsonb(gen_random_uuid()::text), true)
        else item
    end
    from jsonb_array_elements(locations) as records(item);

    get diagnostics saved = row_count;
    update public.map_state
    set version = current_version + 1
    where id = true;

    return jsonb_build_object(
        'conflict', false,
        'version', current_version + 1,
        'saved', saved
    );
end;
$$;

revoke all on function public.get_map_locations() from public, anon, authenticated;
revoke all on function public.replace_map_locations(jsonb, bigint) from public, anon, authenticated;
grant execute on function public.get_map_locations() to service_role;
grant execute on function public.replace_map_locations(jsonb, bigint) to service_role;