class Player < ApplicationRecord
  
  belongs_to :user
  has_one :constparam
  has_one :status
  has_one :info
  has_many :items
end
