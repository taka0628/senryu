from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from db import Base

class result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    game_id = Column(Integer)
    senryu = Column(String(1024))
    topic = Column(String(1024))
    # is_wolf = Column(Boolean)
