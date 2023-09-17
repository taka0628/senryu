from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True)
    dt = Column(DateTime, default=datetime.now(), nullable=True)
    room_id = Column(String(1024), nullable=False)
    username = Column(String(1024), nullable=False)
    post_username = Column(String(1024), nullable=True)
    senryu = Column(String(1024), nullable=False)
    topic = Column(String(1024), nullable=False)
    is_wolf = Column(Boolean, nullable=False)


class topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    theme = Column(String(1024), nullable=False)
    topic1 = Column(String(1024), nullable=False)
    topic2 = Column(String(1024), nullable=False)
