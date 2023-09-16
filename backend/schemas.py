from typing import Optional

from pydantic import BaseModel, Field


class AddResult(BaseModel):
    senryu: str
    topic: str
    is_wolf: bool = Field(False)

    class Config:
        orm_mode = True


class ResultResponse(BaseModel):
    id: int
    game_id: Optional[int] = Field(None)
    senryu: str
    topic: str
    is_wolf: bool = Field(False)

    class Config:
        orm_mode = True


class TopicResponse(BaseModel):
    theme: str
    topic1: str
    topic2: str

    class Config:
        orm_mode = True
