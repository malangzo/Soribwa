from sqlalchemy import Column, Integer, String, Text, LargeBinary, create_engine, SmallInteger, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class CycleData(Base):
    __tablename__ = 'cycleData'
    
    file_uuid = Column(String(255), primary_key=True, nullable=False)
    user_uuid = Column(String(255), nullable=False)
    tsv = Column(LargeBinary, nullable=False)
    
class Realtime_log(Base):
    __tablename__ = 'realtime_log'
    
    timemap = Column(String(40), primary_key=True, nullable=False)
    label = Column(String(20), nullable=False)
    decibel = Column(SmallInteger, nullable=False)

class User_info(Base):
    __tablename__ = 'user_info'
    
    uuid = Column(String(36), primary_key=True, nullable=False)
    email = Column(String(40), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    name = Column(String(20), nullable=False)
    role = Column(String(4), default='user')
    expire_date = Column(String(19), nullable=True)
    user_avatar = Column(LargeBinary, nullable=True)

class Notice_board(Base):
    __tablename__ = 'notice_board'
    
    no = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    content = Column(Text)
    date = Column(DateTime, default=datetime.now())
    file = Column(Text)
    
    
    
