from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import playerdashboardbyyearoveryear
from nba_api.stats.endpoints import playerdashboardbyteamperformance
from prisma import Prisma
import asyncio
import time
import random
import re


async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    await add_db(prisma=prisma)

    await prisma.disconnect()


async def add_db(prisma: Prisma):
    with open('nba_players.txt') as nba_players:
        for player in nba_players:
            result = player[player.find('[')+1: player.find(',')]
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
    'INA': 'IND'
}


if __name__ == '__main__':
    asyncio.run(main())
