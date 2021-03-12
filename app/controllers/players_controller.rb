class PlayersController < ApplicationController

  def index
    #@player = Player.find(params[user_id])
    #gon.name = @player.name
    #gon.race = @player.race
    #gon.gold = @player.gold

    #@constparam = Constparams.find(params[player_id])
    #gon.lv = @constparam.lv
    #gon.attack = @constparam.attack
    #gon.defence = @constparam.defence
    #gon.spd = @constparam.spd

    #@info = Info.find(params[player_id])
    #gon.eventphase = @info.eventphase
    #gon.posx = @info.positionx
    #gon.posy = @info.positiony

    #@status = Status.find(params[player_id])
    #gon.hp = @status.hp
    #gon.mp = @status.mp
    #gon.exp = @status.exp

    #@item = item.find(params[player_id])
    #gon.item = @item.item
    
    @position = Position.create

    #gon.current_user_id = current_user.id
  end

  private

  def player_params
    params.require(:player).permit(:name,:race,:gold).merge(token: params[:token])
  end

end
