class CreateConstparams < ActiveRecord::Migration[6.0]
  def change
    create_table :constparams do |t|

      t.integer  :lv,         null: false
      t.integer  :attack,     null: false
      t.integer  :defence,    null: false
      t.integer  :spd,        null: false

      t.timestamps
    end
  end
end
