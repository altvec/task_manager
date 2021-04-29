FactoryBot.define do
  factory :task do
    name { generate :name }
    description { generate :description }
    author factory: :manager
    assignee factory: :developer
    expired_at { generate :expired_at }
    traits_for_enum(:state, [
                      'archived',
                      'in_code_review',
                      'in_development',
                      'in_qa',
                      'new_task',
                      'ready_for_release',
                      'released',
                    ])
  end
end
