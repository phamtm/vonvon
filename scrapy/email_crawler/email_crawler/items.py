# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class EmailCrawlerItem(scrapy.Item):
    email = scrapy.Field()

class RongbayItem(scrapy.Item):
    email = scrapy.Field()
    fullname = scrapy.Field()
    rongbay_id = scrapy.Field()
