import httplib2
import requests
from bs4 import BeautifulSoup
from prisma import Prisma
import asyncio
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'}


alphabet = ['a', 'd', 'e', 'f', 'h', 'i', 'j', 'k', 'm',
            'o', 'p', 'q', 't', 'u', 'v', 'w', 'x', 'y', 'z']

# alphabet = ['o', 'p', 'q', 't', 'u', 'v', 'w', 'x', 'y', 'z']
# alphabet = ['b', 'c', 'd', 'g', 'l', 'r', 's']

alphabet = [chr(i) for i in range(ord('a'), ord('z')+1)]


async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    for letter in alphabet:
        print("starting letter: ", letter)
        await parse_page(1, letter, prisma)

    # await parse_page(12, 'm', prisma)

    await prisma.disconnect()


# a, z, d


# Kerwynn Williams
# Kevin Williams 1981-1981

async def parse_page(page, letter, prisma: Prisma):
    url = f"https://www.footballdb.com/players/players.html?page={page}&letter={letter}"
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.content, features="html.parser")
    tbody = soup.find('tbody')

    # get all the trs
    trs = tbody.find_all('tr')

    if trs == []:
        print('Finished with letter ' + letter)
        return

    primsa_format = []
    for tr in trs:
        tds = tr.find_all('td')

        if tds[3].text == '--':
            continue

        # get the url
        fdb_url = 'https://www.footballdb.com' + tds[0].find('a')['href']

        # get the position
        position = tds[1].text

        # get the college
        college = tds[2].text

        # get the team
        teamsNotParsed = tds[3].text.split(',')

        # get all numbers in a string
        all_text = re.findall(r'\w+', tds[3].text)
        years = []
        teamsNotParsed = []

        for word in all_text:
            if word.isdigit():
                years.append(word)
            else:
                teamsNotParsed.append(word.upper())

        if not any(x in teamsNotParsed for x in TEAMS):
            continue

        # get the lowest and highest number from years array which is array of strings
        firstYear = min(years)
        lastYear = max(years)

        # get the name
        name = tds[0].text

        # convert last name, comma first name to first name last name
        name = name.split(',')

        if len(name) >= 2:
            firstName = name[1].strip()
            lastName = name[0].strip()
        elif lastYear < '2000':
            continue
        elif len(name) == 1:
            firstName = name[0].strip()
            lastName = ''
        else:
            continue

        if firstName == 'Abdul-Karim':
            firstName = 'Karim'
        if lastName == 'Abdul-Jabbar':
            lastName = 'Al-Jabbar'

        teams = []
        for team in teamsNotParsed:
            if any(x in team for x in ['NFLE', 'AFL', 'AAFC', 'APFA', 'WLAF']):
                continue

            if team not in TEAMS:
                continue

            if team == 'HOU' and int(lastYear) < 2000:
                teams.append('TEN')
            elif team == 'BAL' and int(lastYear) < 1990:
                teams.append('IND')
            elif team == 'STL' and int(lastYear) > 1990 and int(lastYear) < 2020:
                teams.append('LA')
            elif team == 'STL' and int(lastYear) < 1990:
                teams.append('ARI')
            elif team in TEAM_CONVERTER:
                teams.append(TEAM_CONVERTER[team])
            else:
                teams.append(team)

        # if teams is empty
        if not teams:
            continue

        # convert url to profile pic url
        name_id = fdb_url.split('-')[-1]

        if lastYear < '2013':
            profilePic = 'https://images.fantasypros.com/images/players/nfl/22978/headshot/70x70.png'
        else:
            profilePic = try_profile_pics(lastYear, name_id)

        try:
            if f"{firstName} {lastName}" in DUP_PLAYERS and DUP_PLAYERS[f"{firstName} {lastName}"] == firstYear:
                # since our primary key is dependent on the name and years being different
                print(f'Skipping player {firstName} {lastName}')
                continue
                # and there are 2 spencer browns from 2021 - 2023 we are doing this manually
            else:
                await prisma.nflplayer.create(data={
                    'firstName': firstName,
                    'lastName': lastName,
                    'college': college,
                    'yearStart': firstYear,
                    'yearEnd': lastYear,
                    'position': position,
                    'fbdb_page': fdb_url,
                    'profilePic': profilePic
                })

                for team in teams:
                    primsa_format.append({
                        'teamName': team,
                        'playerFirstName': firstName,
                        'playerLastName': lastName,
                        'playerYearStart': firstYear,
                        'playerYearEnd': lastYear,
                    })

                if len(primsa_format) > 10:
                    result = await prisma.nflplayer_team.create_many(data=primsa_format, skip_duplicates=True)
                    print('Created teams')
                    primsa_format = []
        except Exception as e:
            print(e)
            print('Failed with', firstName, lastName)

    # result = await prisma.player_team.create_many(data=primsa_format, skip_duplicates=True)
    # get the next page
    page += 1
    print('Moving to page', page, 'with letter', letter)

    if primsa_format != []:
        result = await prisma.nflplayer_team.create_many(data=primsa_format, skip_duplicates=True)
        print('Created teams')
        primsa_format = []

    await parse_page(page, letter, prisma)


def try_profile_pics(lastYear, name_id):
    h = httplib2.Http()

    number_subtracted = 1

    works = False
    while works == False and number_subtracted < 4:
        profile_pic_url = f"https://cdn.footballdb.com/headshots/NFL/{str(int(lastYear)-number_subtracted)}/{name_id}.jpg"

        resp = h.request(profile_pic_url, 'HEAD')

        if int(resp[0]['status']) < 400:
            works = True
            return profile_pic_url
        else:
            number_subtracted += 1

    return 'https://images.fantasypros.com/images/players/nfl/22978/headshot/70x70.png'


# do the update many,
#
# LV -> (oak, lar)
# NE -> (bos)
# LAC -> (sd)
# KC -> (dalT)
# TEN -> (hou before 2000)
# IND -> (bal before 1990)
# LA -> (stl(between 1990-2020))
# ARI -> (stl(before 1990), pho, chiC)
TEAM_CONVERTER = {
    'OAK': 'LV',
    'LAR': 'LV',
    'BOS': 'NE',
    'SD': 'LAC',
    'dalT': 'KC',
    'pho': 'ARI',
    'chiC': 'ARI',
}

DUP_PLAYERS = {
    "Spencer Brown": 2021,
    "Bill Clark": 1920,
    "Michael Carter": 2021,
    "Jack Davis": 1960,
    "T.J. Carter": 2022,
    "Steve Griffin": 1987,
    "David Long": 2019,
    "Jim Reynolds": 1946,
    "Jack Sullivan": 1921,
    "Jeff Smith": 1987
}

TEAMS = [
    "MIA",
    "HOU",
    "BAL",
    "JAX",
    "CAR",
    "TB",
    "SEA",
    "CIN",
    "NO",
    "ATL",
    "MIN",
    "BUF",
    "TEN",
    "OIL",
    "LV",
    "NE",
    "NYJ",
    "DEN",
    "LAC",
    "KC",
    "DAL",
    "IND",
    "CLE",
    "SF",
    "LA",
    "PIT",
    "PHI",
    "WAS",
    "DET",
    "NYG",
    "GB",
    "CHI",
    "ARI",
    "OAK",
    "LAR",
    "BOS",
    "SD",
    "dalT",
    "pho",
    "chiC",
]

# give me an sql query that returns everyone with same first name


if __name__ == '__main__':
    asyncio.run(main())


# SELECT
# 	"firstName",
# 	"lastName",
#         "yearStart",
#         "yearEnd",
# 	COUNT(*)
# FROM
# 	"Player"
# GROUP BY
# 	"firstName",
# 	"lastName",
#         "yearStart",
#         "yearEnd"
# HAVING
# 	COUNT(*) > 1

# JACK DAVIS


# BILL CLARK -> (OG) and (OG/C)
# JIM REYNOLDS -> (DB) and (RB/LB)
# SPENCER BROWN -> (OT -> T)
# DB, S -> LB

# Spencer Brown 2021
# Bill Clark 1920, Michael Carter 2021, T.J. Carter 2022
# Jack Davis 1960
# Steve Griffin 1987
# David Long 2019
# Jim Reynolds 1946
# Jack Sullivan 1921, Jeff Smith 1987
