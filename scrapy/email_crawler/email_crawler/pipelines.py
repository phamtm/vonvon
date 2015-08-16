# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
from email_crawler import db_connection


INSERT_SQL = 'insert into email(email, mobile, found_on, external_id, name) values(%s, %s, %s, %s, %s)'


class PostgresPipeline(object):
    def process_item(self, item, spider):
        try:
            cursor = db_connection.cursor()
            cursor.execute(INSERT_SQL,
                (item['email'], None, 'rongbay.com',
                   item['rongbay_id'], item['fullname']))
        except:
            pass

        return item
