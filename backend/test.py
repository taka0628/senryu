from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.models import Base

# from db.db import Base

import db.db as db
import db.models as model


if __name__ == "__main__":
    db.add_topics(model.topic(theme="IT", topic1="ハッカソン", topic2="プログラミング言語"))
