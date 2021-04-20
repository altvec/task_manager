Rails.application.routes.draw do
  root :to => "web/boards#show"

  scope module: :web do
    resource :board, only: :show
    resource :session, only: :new
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
