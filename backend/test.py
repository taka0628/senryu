from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.models import Base

# from db.db import Base

import db.db as db
import db.models as model

import uuid


if __name__ == "__main__":
    db.get_topics()
    print(db.get_topic())
    db.add_result(
        model.result(
            room_id=uuid.uuid1(),
            senryu="ハッカソン\n創意の競演\n未来の鍵",
            username="test_user",
            topic="ハッカソン",
            is_wolf=True,
        )
    )
    # print(db.get_room_result("bbf8d144-54fa-11ee-ba2c-0242ac150002"))
    print(db.get_results())
