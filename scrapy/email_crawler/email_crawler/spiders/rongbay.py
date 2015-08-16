# -*- coding: utf-8 -*-
import re

from scrapy.spiders import Spider

from email_crawler.items import RongbayItem
from email_crawler import redis_connection


NON_USER_EMAILS = ('Lienhe@rongbay.com', 'lienhe@rongbay.com')
PATTERN_URL_MEMBER = 'http://rongbay.com/member-{0}.html'
PATTERN_EMAIL = r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)"
PATTERN_EMAIL_ORDINAL = re.compile(r'fromCharCode\((\d+,?)+\)')
ABS_MIN_ID = 170000
ABS_MAX_ID = 1463996
MIN_ID = 275000
MAX_ID = 400000


class RongbaySpider(Spider):
    name = 'rongbay'
    allowed_domains = ['rongbay.com']
    start_urls = [PATTERN_URL_MEMBER.format(id) for id in range(MIN_ID, MAX_ID)]

    def extract_email(self, html):
        matches = re.findall(PATTERN_EMAIL, html)
        emails = [m[0] for m in matches]
        user_emails = [e for e in emails if e not in NON_USER_EMAILS]

        if len(user_emails) == 0:
            return None

        return user_emails[0]

    def parse(self, response):
        doms = response.css('.cl_333 b::text')

        fullname = None
        rongbay_id = None
        if len(doms) > 1:
            rongbay_id = doms[0].extract()
            fullname = doms[1].extract()
        else:
            rongbay_id = doms.extract_first()

        email = self.extract_email(response.body)

        # Add to redis
        # if email:
            # redis_connection.lpush(self.name, email)

        # Return to process
        item = RongbayItem()
        item['email'] = email
        item['fullname'] = fullname
        item['rongbay_id'] = rongbay_id

        return item
