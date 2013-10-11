import model


def load_movies(filename, session):
    movies = {}
    for item in filename:
        title = item["title"]
        if movies[title] == None:
            movies[title] = item["location"]
            movie = model.Movie(title=item["title"], year=item["release_year"], director=item["director"])
            session.add(movie)
        else:
            movies[title].append(item["location"])
    session.commit()


def load_locations(filename, session):
    locations = {}
    for item in filename:
        site = item["location"]
        if locations[site] == None:
            locations[site] = item["title"]
            location = model.Location(description=item["locations"], movies=item["title"], latitude=None, longitude=None)
            session.add(location)
        else:
            locations[site].append(item["title"])
    session.commit()



def main(session):
    filename = 'data.json'
    json = open(filename)
    load_movies(json)
    load_locations(json)



if __name__ == "__main__":
    s = model.session
    main(s)

