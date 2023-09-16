from wtforms import BooleanField, Form, IntegerField, StringField
from wtforms.validators import InputRequired, DataRequired


class ResultForm(Form):
    game_id = IntegerField('game_id', validators=[DataRequired()])
    senryu = StringField('senryu', validators=[DataRequired()])
    topic = StringField('topic', validators=[DataRequired()])
    is_wolf = BooleanField('is_wolf', validators=[InputRequired()])
