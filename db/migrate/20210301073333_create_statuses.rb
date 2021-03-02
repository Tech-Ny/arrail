class CreateStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :statuses do |t|

      t.integer :hp,    null: false
      t.integer :mp,    null: false
      t.integer :exp,   null: false

      t.timestamps
    end
  end
end
