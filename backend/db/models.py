from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    game_id = Column(Integer, nullable=False)
    senryu = Column(String(1024), nullable=False)
    topic = Column(String(1024), nullable=False)
    is_wolf = Column(Boolean, nullable=False)


class topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    theme = Column(String(1024), nullable=False)
    topic1 = Column(String(1024), nullable=False)
    topic2 = Column(String(1024), nullable=False)
