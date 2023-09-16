from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.models import Base

# from db.db import Base

import db.db as db
import db.models as model


DB_URL = "mysql+pymysql://root@db:3306/senryu?charset=utf8"
engine = create_engine(DB_URL, echo=True)
Session = sessionmaker(bind=engine)


# PydanticモデルをSQLAlchemyモデルに変換する関数
def pydantic_to_sqlalchemy(pydantic_model):
    return model.result(**pydantic_model.dict())


def add_result(result: model.result):
    session = Session()
    session.add(result)
    session.commit()


def add_topics(topic: model.topic):
    session = Session()
    # データベースにデータを挿入
    session.add(topic)
    session.commit()


def make_sample_topics():
    add_result(model.topic(theme="IT", topic1="ハッカソン", topic2="プログラミング言語"))


def make_sample_results():
    add_result(
        model.result(
            game_id=1, senryu="ハッカソン\n創意の競演\n未来の鍵", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=1, senryu="コードの語\n画面に響く\n夢のシンフォニー", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=1, senryu="チームの絆\n一糸乱れぬ\n目指す成功", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=1, senryu="Pythonの\nコード\n優雅な舞", topic="プログラミング言語", is_wolf=True
        )
    )
    add_result(
        model.result(
            game_id=2, senryu="カフェイン注入\n仲間と笑顔\n夜が明ける", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=2, senryu="デジタルの森\nアイデアの芽\n成長の季", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=2, senryu="コンピュータ\n数字と文字\n未来の詩", topic="ハッカソン", is_wolf=False
        )
    )
    add_result(
        model.result(
            game_id=2,
            senryu="JavaScript\nウェブの魔法\n輝く星",
            topic="プログラミング言語",
            is_wolf=True,
        )
    )


def get_results():
    session = Session()
    db = session.query(model.result).all()
    for row in db:
        print(row)


def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    make_sample_results()
    # db.add_result(db.get_db(), add_result)
    make_sample_topics()
    print(db.get_results())


if __name__ == "__main__":
    reset_database()
