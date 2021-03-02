class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|

      t.string      :name,        null: false
      t.string      :race,        null: false
      t.integer     :gold,        null: false
      t.references  :users,       null: false, foreign_key: true
      t.references  :statuses,    null: false, foerign_key: true
      t.references  :constparams, null: false, foreign_key: true
      t.references  :infos,       null: false, foreign_key: true
      t.timestamps
    end
  end
end
