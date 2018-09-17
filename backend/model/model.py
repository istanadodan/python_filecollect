import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base

conn = sa.create_engine("sqlite:///fileinfo.db")

Base = declarative_base()
class Album(Base):
    __tablename__ = "album"
    album = sa.Column('album', sa.String)
    filename = sa.Column('filename', sa.String, primary_key=True)
    width = sa.Column('width', sa.Integer)
    height = sa.Column('height', sa.Integer)
    size = sa.Column('size',sa.Integer)

    def __init__(self, album, filename, width, height, size):
        self.album = album
        self.filename = filename
        self.width = width
        self.height = height
        self.size = size

    def __str__(self):
        return "<Album({},{},{},{})>".format(self.filename,self.width,self.height,self.size)

# Table creation
Base.metadata.create_all(conn)

print("Base.metadata.create_all")