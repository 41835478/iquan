class ProductClick < ApplicationRecord
  self.table_name = 'iquan_product_clicks'
end

class ICookie < ApplicationRecord
  self.table_name = 'iquan_cookies'
end

class Link < ApplicationRecord
  self.table_name = 'iquan_links'
end

class AppDownload < ApplicationRecord
  self.table_name = 'iquan_app_downloads'
end
