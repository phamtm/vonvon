# -*- coding: utf-8 -*-
import re

import scrapy
from scrapy.spiders import Spider

from email_crawler.items import EmailCrawlerItem
from email_crawler import redis_connection


class VnexpressSpider(Spider):
    _RE = re.compile(r'rao-vat/\d+/.+/.*\.html')
    name = "vnexpress"
    allowed_domains = ["raovat.vnexpress.net"]
    start_urls = (
        'http://raovat.vnexpress.net/',
    )
    # rules = (
    #     Rule(LinkExtractor(allow=('_PARSE_REGEX')), callback='parse_email'),
    # )

    def parse(self, response):
        email = response.css('.user span::text').extract_first()
        # Add to redis
        if email:
            redis_connection.sadd('email', email)

        for href in response.css("a::attr('href')"):
            url = response.urljoin(href.extract())
            yield scrapy.Request(url)

    def parse_item(self, response):
        email = response.css('.user span::text').extract_first()

        # Add to redis
        redis_connection.sadd(self.name, email)

        # Return to process
        item = EmailCrawlerItem()
        item['email'] = email

        return item
