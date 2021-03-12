class CreatePositions < ActiveRecord::Migration[6.0]
  def change
    create_table :positions do |t|

      t.integer     :posx ,null: false
      t.integer     :posy ,null: false
      t.references  :user ,null: false, foreign_key: true
      t.timestamps
    end
  end
end
