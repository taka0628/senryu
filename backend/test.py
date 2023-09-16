from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.models import Base

# from db.db import Base

import db.db as db
import db.models as model


if __name__ == "__main__":
    db.get_results()
