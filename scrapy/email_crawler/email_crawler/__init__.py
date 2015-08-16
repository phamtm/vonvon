import redis
import psycopg2


# Redis
redis_connection = redis.StrictRedis(
    host='localhost',
    port=6379,
    db=0,
    password=None)

# Postgres Database
db_connection = psycopg2.connect(
    dbname='minhpham',
    user='minhpham',
    # password='',
    host='localhost',
    port='5432',
)
db_connection.set_session(autocommit=True)
