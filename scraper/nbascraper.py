from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import playerdashboardbyyearoveryear
from nba_api.stats.endpoints import playerdashboardbyteamperformance
from prisma import Prisma
import asyncio


async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    await add_db(prisma=prisma)

    await prisma.disconnect()


async def add_db(prisma: Prisma):
    nba_players = players.get_players()
    player_info = commonplayerinfo.CommonPlayerInfo(player_id=1628386)

    for player in nba_players:
        firstName = player['first_name']
        lastName = player['last_name']
        isActive = player['is_active']
        id = player['id']

        career = playercareerstats.PlayerCareerStats(player_id=id)

        teams = set()

        for year in career.season_rankings_regular_season.get_dict()['data']:
            teams.add(year[4])

        await prisma.nbaplayer.create(data={
            'firstName': firstName,
            'lastName': lastName,
            'isActive': isActive,
            'id': id,
            'profilePic': f"https://cdn.nba.com/headshots/nba/latest/1040x760/{id}.png"
        })

        for team in teams:
            await prisma.nbaplayer_team.create(data={
                'playerId': id,
                'teamName': team
            })

        print("CREATED", firstName, lastName)


if __name__ == '__main__':
    asyncio.run(main())
