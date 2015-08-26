import time
import uuid

import redis

rs = redis.Redis()
RANDOM_QUEUE_NAME = 'queue'


def dequeue():
    qlen = rs.zcard(RANDOM_QUEUE_NAME)
    if qlen < 1:
        return

    ids = rs.zrange(RANDOM_QUEUE_NAME, 0, -1)

    if not ids or len(ids) < 1:
        return

    i = 0
    while (i + 1 < len(ids)):
        id1 = ids[i]
        id2 = ids[i + 1]
        roomId = uuid.uuid1().hex

        print 'Matching:: %s # %s' % (id1, id2)

        p = rs.pipeline(transaction=True)
        p.zrem(RANDOM_QUEUE_NAME, id1)
        p.zrem(RANDOM_QUEUE_NAME, id2)
        p.execute()
        rs.publish(id1, id2 + '#' + roomId)
        rs.publish(id2, id1 + '#' + roomId)
        i += 2


if __name__ == '__main__':
    cnt = 0
    while True:
        cnt += 1
        time.sleep(0.05)
        dequeue()
