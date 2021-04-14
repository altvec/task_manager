FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :avatar, :type] do |n|
    "string#{n}"
  end
  sequence(:email) { |n| "user#{n}@example.com" }

  sequence(:name) { |n| "name #{n}" }

  sequence(:description) { |n| "description #{n}" }

  sequence(:state) { |n| "state #{n}" }

  sequence(:expired_at) { |n| "expired_at #{n}" }
end
