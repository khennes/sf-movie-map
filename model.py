from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, Float, String, ForeignKey 
from sqlalchemy.orm import relationship, backref, sessionmaker, scoped_session

engine = create_engine('postgresql://films.db', echo=False)
session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))

Base = declarative_base()
Base.query = session.query_property()


## Class declarations

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key = True)
    title = Column(String(64))
    year = Column(String(4))
    director = Column(String(64))


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key = True)
    description = Column(String(128))
    movies = Column(String(256))
    latitude = Column(Float)
    longitude = Column(Float)


def main():
    pass

if __name__ == "__main__":
    main()
