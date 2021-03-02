class CreateInfos < ActiveRecord::Migration[6.0]
  def change
    create_table :infos do |t|

      t.integer     :eventphase, null:false
      t.integer     :positionx,  null:false
      t.integer     :positiony,  null:false

    end
  end
end
