require 'test_helper'

class Admin::UsersControllerTest < ActionController::TestCase
  setup do
    admin = create(:admin)
    sign_in admin
  end

  test 'should get index' do
    get :index
    assert_response :success
  end
end
