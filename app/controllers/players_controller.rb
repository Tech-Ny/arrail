class PlayersController < ApplicationController
  before_action :player_params, only: [:new,:edit]

  def index
    @players = Player.all
  end

  def new

    @player = Player.new(player_params)
    if @player.save
      redirect_to players_path
    else 
      render index
    end

  end

  def create
    @player = Player.create(player_params)
    redirect_to players_path
  end

  private
  def player_params
    params.permit(:players).permit(:posx,:posy,user_id:current_user.id)
  end

  #def player_set
  #  @player = Player.find(user_id.current_user.id)
  #end

end
