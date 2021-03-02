Rails.application.routes.draw do

  devise_for :users
  root to: 'players#index'
  resources :players

end
