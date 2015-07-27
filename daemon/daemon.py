import random
import time

import redis

rs = redis.Redis()
RANDOM_QUEUE_NAME = 'queue'


def populate():
    """ Populate the queue with some dummy ids. """
    rs.zadd(RANDOM_QUEUE_NAME, 'a', random.random())
    rs.zadd(RANDOM_QUEUE_NAME, 'b', random.random())
    rs.zadd(RANDOM_QUEUE_NAME, 'c', random.random())
    rs.zadd(RANDOM_QUEUE_NAME, 'd', random.random())
    rs.zadd(RANDOM_QUEUE_NAME, 'e', random.random())
    rs.zadd(RANDOM_QUEUE_NAME, 'f', random.random())


def dequeue():
    qlen = rs.zcard(RANDOM_QUEUE_NAME)
    if qlen < 1:
        return

    ids = rs.zrange(RANDOM_QUEUE_NAME, 0, -1)
    print 'ids', ids

    if not ids or len(ids) < 1:
        return

    i = 0
    while (i + 1 < len(ids)):
        id1 = ids[i]
        id2 = ids[i + 1]
        print id1, id2

        p = rs.pipeline(transaction=True)
        p.zrem(RANDOM_QUEUE_NAME, id1)
        p.zrem(RANDOM_QUEUE_NAME, id2)
        p.execute()
        rs.publish(id1, id2)
        rs.publish(id2, id1)
        i += 2


if __name__ == '__main__':
    cnt = 0
    while True:
        cnt += 1
        time.sleep(0.1)
        dequeue()
