from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=256)


class AdminMe(BaseModel):
    username: str


class MessageReadUpdate(BaseModel):
    is_read: bool
