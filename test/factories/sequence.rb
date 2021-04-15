FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :avatar, :type] do |n|
    "string#{n}"
  end
  sequence(:email) { |n| "user#{n}@example.com" }

  sequence(:name) { |n| "name #{n}" }

  sequence(:description) { |n| "description #{n}" }

  sequence(:expired_at) { |n| (rand(n) + 1).days.from_now }
end
