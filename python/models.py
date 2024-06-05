from sqlalchemy import Column, Integer, String, Text, LargeBinary, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class CycleData(Base):
    __tablename__ = 'cycleData'
    
    file_uuid = Column(String(255), primary_key=True, nullable=False)
    user_uuid = Column(String(255), nullable=False)
    tsv = Column(LargeBinary, nullable=False)
