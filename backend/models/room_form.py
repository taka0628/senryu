from wtforms import BooleanField, Form, IntegerField, StringField
from wtforms.validators import InputRequired, DataRequired


class RoomForm(Form):
    id = StringField('id', validators=[DataRequired()])
    name = StringField('name', validators=[DataRequired()])
    user_cnt = IntegerField('user_cnt', validators=[DataRequired()])
    theme = StringField('theme')
    topic1 = StringField('topic1')
    topic2 = StringField('topic2')
