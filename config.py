from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# instantiate ap and set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# define metadata, set up Flask-Migrate for migrations, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# enables Cross-Origin Resource Sharing, allowing requests front-end
CORS(app)

# generate a secret key in command prompt using this command:
# `python -c 'import os; print(os.urandom(16))'`
app.config['SECRET_KEY'] = '\xf0W\x12\x96V\xfc\x00\xe9\xec7\x8b\xd8\xfe\xd5\x0f1'

"""

The flask db migrate command does not generate databases, it generates migration scripts. The correct process is as follows:

flask db init when you set up your migration repository
create or modify your database models
flask db migrate to generate a migration script for the changes made in step 2
flask db upgrade to apply the changes in the migration script generated in step 3
go back to step 2

"""