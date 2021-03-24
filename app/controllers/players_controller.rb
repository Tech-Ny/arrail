class PlayersController < ApplicationController
  before_action :player_params, only: [:new,:show]
  before_action :player_set, only: [:show,:update]
  before_action :update_params, only: [:update]

  def index
    @players = Player.all
    if @players.exists?(user_id:current_user.id)
      player_set
    end
  end

  def new
  end

  def create
    @player = Player.create(player_params)
    redirect_to players_path
  end

  def show
    gon.player = @player
  end

  def update
    @player.update(update_params)
    redirect_to player_path(@player.id)
    
  end

  private
  def player_params
    #playerを定めずposx:posyのみを設定
    params.permit(:posx,:posy,:playerhp,:playermaxhp,:playermp,:playermaxmp,:playeratk,:playerspd,:playerdef,:lv,:exp).merge(user_id:current_user.id)
  end

  def update_params
    #updateにはidが必要なのでplayerをrequireしておく
    params.require(:player).permit(:posx,:posy,:playerhp,:playermaxhp,:playermp,:playermaxmp,:playeratk,:playerspd,:playerdef,:lv,:exp).merge(user_id:current_user.id)
  end

  def player_set
    #idからではなくuser_idを参照してindexからでも1対1の関係を作る
    @player = Player.find_by(user_id:current_user.id)
  end

end
