FactoryBot.define do
  factory :task do
    name { generate :name }
    description { generate :description }
    author factory: :manager
    assignee factory: :developer
    state { :new_task }
    expired_at { generate :expired_at }
  end
end
