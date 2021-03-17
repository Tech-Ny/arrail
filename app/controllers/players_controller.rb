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
  end

  def update
    @player.update(update_params)
    redirect_to player_path(@player.id)
    
  end

  private
  def player_params
    params.permit(:posx,:posy).merge(user_id:current_user.id)
  end

  def update_params
    params.require(:player).permit(:posx,:posy).merge(user_id:current_user.id)
  end

  def player_set
    @player = Player.find_by(user_id:current_user.id)
  end

end
