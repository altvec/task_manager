FactoryBot.define do
  factory :user do
    first_name { generate :string }
    last_name { generate :string }
    password { generate :string }
    email { generate :email }
    avatar { generate :string }
    type { 'User' }
  end

  factory :developer, parent: :user do
    type { 'Developer' }
  end

  factory :manager, parent: :user do
    type { 'Manager' }
  end

  factory :admin, parent: :user do
    type { 'Admin' }
  end
end
