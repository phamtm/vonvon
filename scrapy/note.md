scrapy shell http://[url]

raovat.vnexpress: 
- Get email: response.xpath('//div[@class="user"]/span/text()').extract()
- Get mobile: response.xpath('//div[@class="contact"]/span/text()').extract()

rongbay.com:
- Get email: response.xpath('//div[@class="user_img"]/a/text()').extract()
- Get mobile: response.xpath('//div[@class="cl_333 user_phone font_14 font_700"]/p/text()').extract()