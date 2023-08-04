from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import playerdashboardbyyearoveryear
from nba_api.stats.endpoints import playerdashboardbyteamperformance
from nba_api.stats.endpoints import playerawards
from prisma import Prisma
import asyncio
import time
import random
import re
from datetime import datetime
import httplib2


async def main() -> None:
    prisma = Prisma()
    await prisma.connect()
    l_mans = players.get_players()

    for play in l_mans:
        await add_link_to_person(prisma, play['id'], play['first_name'], play['last_name'], 1)
        
        
    # await update_info(prisma=prisma)

    # await awards(prisma=prisma)
    # await add_db(prisma=prisma, id=201593)

    await prisma.disconnect()

async def add_link_to_person(prisma: Prisma, id, firstName, lastName, number): 
    if number > 4:
        print(f'Error for {id} {firstName} {lastName}')
    first_letter_last_name = lastName[0].lower()

    # first 5 letters (or less if name shorter) of last name
    first_5_letters_last_name = lastName[0:5].lower()
    first_2_letters_first_name = firstName[0:2].lower()
    link = f'https://www.basketball-reference.com/players/{first_letter_last_name}/{first_5_letters_last_name}{first_2_letters_first_name}0{number}.html'

    await prisma.nbaplayer.update(data={
                        "bbref_page": link
                    }, where={
                        "id": id
                    })
    return link



async def update_info(prisma: Prisma):
    with open('nba_players.txt') as nba_players:
        for player in nba_players:
            result = player[player.find('[')+1: player.find(',')]
            player_info = commonplayerinfo.CommonPlayerInfo(player_id=result)
            career = playercareerstats.PlayerCareerStats(player_id=result)

            player_info = player_info.common_player_info.get_dict()['data'][0]

            birthday = datetime.strptime(player_info[7], '%Y-%m-%dT%H:%M:%S')
            school = player_info[8]
            country = player_info[9]
            height = player_info[11] if player_info[11] != '' else ""
            weight = player_info[12] if player_info[12] != '' else 0
            number_seasons = player_info[13]
            jersey_number = player_info[14] if player_info[14] != '' else ""
            draft_year = player_info[29]
            draft_round = player_info[30]
            draft_number = player_info[31]
            greatest_75 = player_info[32] == "Y"

            draft = ""

            if draft_year == "Undrafted":
                draft = "Undrafted"
            else:
                draft = f'{draft_year},{draft_round},{draft_number}'

            season_totals = career.season_totals_regular_season.get_dict()[
                'data']
            career_totals = career.career_totals_regular_season.get_dict()[
                'data']

            career_totals = career_totals[0] if career_totals else []

            games_played = career_totals[3] if career_totals and career_totals[3] else 0
            minutes = career_totals[5] if career_totals and career_totals[5] else 0
            fg3_pct = career_totals[11] if career_totals and career_totals[13] else "0.0"
            ft_pct = career_totals[14] if career_totals and career_totals[14] else "0.0"
            reb = career_totals[17] if career_totals and career_totals[17] else 0
            ast = career_totals[18] if career_totals and career_totals[18] else 0
            stl = career_totals[19] if career_totals and career_totals[19] else 0
            blk = career_totals[20] if career_totals and career_totals[20] else 0
            tov = career_totals[21] if career_totals and career_totals[21] else 0
            pts = career_totals[23] if career_totals and career_totals[23] else 0

            teams = set()

            for season in season_totals:
                if (season[4] != 'TOT' and season[4]):
                    teams.add(season[4])

            formatted_teams = []

            for team in teams:
                if team in EXCLUDED_TEAMS:
                    continue

                if team in TEAM_CONVERTER:
                    team = TEAM_CONVERTER[team]

                formatted_teams.append({
                    'playerId': int(result),
                    'teamName': team
                })

            res = []
            [res.append(x) for x in formatted_teams if x not in res]

            # await prisma.nbaplayer_team.create_many(data=res, skip_duplicates=True)
            await prisma.nbaplayer.update(data={
                "birthday": birthday,
                "school": school,
                "country": country,
                "height": height,
                "weight": int(weight),
                "number_seasons": int(number_seasons),
                "jersey_number": jersey_number,
                "draft": draft,
                "greatest_75": greatest_75,
                "games_played": int(games_played),
                "minutes": int(minutes),
                "fg3_pct": str(fg3_pct),
                "ft_pct": str(ft_pct),
                "reb": int(reb),
                "ast": int(ast),
                "stl": int(stl),
                "blk": int(blk),
                "tov": int(tov),
                "pts": int(pts),
                "profilePic": try_profile_pics(f"https://cdn.nba.com/headshots/nba/latest/1040x760/{result}.png")
            }, where={
                "id": int(result)
            })

            print(f'UPDATED {player_info[3]}')
            nba_cooldown = random.gammavariate(
                                alpha=9, beta=0.4)
            time.sleep(nba_cooldown/2)


async def add_db(prisma: Prisma, id=None):
    with open('nba_players.txt') as nba_players:
        for player in nba_players:
            result = player[player.find('[')+1: player.find(',')]
            if id:
                result = id
            player = players.find_player_by_id(result)

            firstName = player['first_name']
            lastName = player['last_name']
            isActive = player['is_active']
            id = player['id']

            player_info = commonplayerinfo.CommonPlayerInfo(player_id=id)
            career = playercareerstats.PlayerCareerStats(player_id=id)

            teams = set()

            for year in career.season_rankings_regular_season.get_dict()['data']:
                teams.add(year[4])

            profilePic = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{id}.png"
            position = player_info.common_player_info.get_dict()['data'][0][15]
            yearStart = f"{player_info.common_player_info.get_dict()['data'][0][24]}"
            yearEnd = f"{player_info.common_player_info.get_dict()['data'][0][25]}"

            try:
                await prisma.nbaplayer.create(data={
                    'id': id,
                    'firstName': firstName,
                    'lastName': lastName,
                    'isActive': isActive,
                    'profilePic': profilePic,
                    'position':  position,
                    'yearStart': yearStart,
                    'yearEnd':  yearEnd
                })

                foramtted_teams = []

                for team in teams:
                    if team in EXCLUDED_TEAMS:
                        continue

                    if team in TEAM_CONVERTER:
                        team = TEAM_CONVERTER[team]

                    foramtted_teams.append({
                        'playerId': id,
                        'teamName': team
                    })

                res = []
                [res.append(x) for x in foramtted_teams if x not in res]

                await prisma.nbaplayer_team.create_many(data=res, skip_duplicates=True)

                nba_cooldown = random.gammavariate(alpha=9, beta=0.4)
                time.sleep(nba_cooldown)

            except Exception as error:
                print(error)
                # print error to a a file
                with open('error.txt', 'a') as f:
                    f.write(f'{error, player}\n')

            print("CREATED", firstName, lastName)
            if id:
                return

TEAM_CONVERTER = {
    'GOS': 'GSW',
    'SAN': 'SAS',
    'UTH': 'UTA',
    'SDC': 'LAC',
    'NJN': 'BKN',
    'CIN': 'SAC',
    'SEA': 'OKC',
    'CHH': 'CHA',
    'SYR': 'PHL',
    'VAN': 'MEM',
    'SDR': 'HOU',
    'PHI': 'PHL',
    'NOH': 'NOP',
    'SFW': "GSW",
    'PHW': 'PHL',
    'BLT': 'WAS',
    'MNL': 'LAL',
    'STL': 'ATL',
    'NOJ': 'UTA',
    'KCO': 'SAC',
    'MIH': 'ATL',
    'NOK': 'NOP',
    'BUF': 'LAC',
    'BAL': 'WAS',
    'WSB': 'WAS',
    'TRI': 'ATL',
    'MLH': 'ATL',
    'ROC': 'SAC',
    'KCK': 'SAC',
    'INA': 'IND',
    'BOM': 'ATL',
    'NYN': 'NYK',
    'CHS': 'CHI',
    'INO': 'IND',
    'DN': 'DEN',
    'CLR': 'CLE',
    'TCB': 'ATL',
    'CHZ': 'CHI',
    'CHP': 'CHI',
    'HUS': 'TOR',
    'JET': 'IND',
    'CAP': 'WAS'
}

EXCLUDED_TEAMS = ["PIT", "FTW", "DEF", "PRO", "AND", "WAT", "SHE"]


async def awards(prisma: Prisma):
    l_mans = players.get_players()
    for player in l_mans:
        awards = playerawards.PlayerAwards(player_id=player["id"])

        if awards:
            for award in awards.get_dict()["resultSets"][0]["rowSet"]:
                if award[4] == "All-NBA":
                    await prisma.nbaplayer.update(data={
                        "isAllNBA": True
                    }, where={
                        "id": player["id"]
                    })
                    break

        nba_cooldown = random.gammavariate(alpha=9, beta=0.4)
        print(nba_cooldown, player)


def try_profile_pics(profile_pic_url):
    h = httplib2.Http()

    resp = h.request(profile_pic_url, 'HEAD')

    if int(resp[0]['status']) < 400:
        works = True
        return profile_pic_url
    else:
        return "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png"


if __name__ == '__main__':
    asyncio.run(main())
