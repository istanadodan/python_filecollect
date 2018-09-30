from sqlalchemy.orm import sessionmaker
from .model import Album,Base,conn

Session = sessionmaker(bind=conn)
session = Session()

class Model:
    def __init__(self):
        pass

    def get_all(self):
        return session.query(Album).all()
    
    def get_album_name(self):
        return session.query(Album.album).group_by(Album.album).all()
    
    def get_image_name(self,name):
        return session.query(Album.filename, Album.width, Album.height).filter_by(album=name).all()
    
    def insert_all(self,albums):
        session.add_all(albums)
        session.commit()
    
    def close(self):
        session.close()
