# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

# from sqlalchemy.orm import sessionmaker, declarative_base

# import db.models as db_model
# import schemas as schema

# from typing import List, Tuple, Optional

# from sqlalchemy import select, create_engine
# from sqlalchemy.engine import Result
# from sqlalchemy.ext.asyncio import AsyncSession

# from sqlalchemy.orm import sessionmaker, declarative_base

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# from db.db import Base

import db.db as db
import db.models as db_model

ASYNC_DB_URL = "mysql+pymysql://root@db:3306/senryu?charset=utf8"

engine = create_engine(ASYNC_DB_URL, echo=True)
Session = sessionmaker(
    bind=engine,
)
session = Session()


def add_result(result: db_model.result):
    session.add(result)
    session.commit()


def add_topics(topic: db_model.topic):
    session.add(topic)
    session.commit()


def get_results():
    # データを取得
    # results = session.query(db_model.result).all()
    # session = Session()
    db = session.query(db_model.result).all()
    # return db
    return remove_unused_key([result.__dict__ for result in db])
    # # 結果を出力
    # for result in results:
    #     print(
    #         f"ID: {result.id}, Game ID: {result.game_id}, Senryu: {result.senryu}, Topic: {result.topic}, Is Wolf: {result.is_wolf}"
    #     )


def get_topics():
    # データを取得
    # results = session.query(db_model.result).all()
    # session = Session()
    db = session.query(db_model.topic).all()
    # return db
    return remove_unused_key([topic.__dict__ for topic in db])


# async def add_result(db: AsyncSession, add_result: schema.AddResult) -> model.result:
#     result = model.result(**add_result.model_dump())

#     db.add(result)
#     await db.commit()
#     await db.refresh(result)
#     return result


def remove_unused_key(li):
    return [
        {key: value for key, value in item.items() if key != "_sa_instance_state"}
        for item in li
    ]
