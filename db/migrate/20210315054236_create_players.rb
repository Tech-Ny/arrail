class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|

      t.integer       :posx    ,null: false
      t.integer       :posy    ,null: false
      t.integer       :playerhp       ,null: false
      t.integer       :playermaxhp    ,null: false
      t.integer       :playermp       ,null: false
      t.integer       :playermaxmp    ,null: false
      t.integer       :playeratk      ,null: false
      t.integer       :playerspd      ,null: false
      t.integer       :playerdef      ,null: false
      t.integer       :lv             ,null: false
      t.integer       :exp            ,null: false
      #t.integer      :race_id ,null: false
      #t.integer      :job_id  ,null: false
      #t.integer      :level   ,unll: false
      #t.integer      :exp     ,null: false
      t.references    :user    ,null: false

      t.timestamps
    end
  end
end
