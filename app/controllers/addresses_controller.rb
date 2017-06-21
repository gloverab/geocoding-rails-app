require 'pry'

class AddressesController < ApplicationController

  def index
    @addresses = Address.all
  end

  def create
    @address = Address.new(address_params)

    respond_to do |format|
      if @address.save
        format.html
        format.js
      end
    end
  end

  private

  def address_params
    params.require(:address).permit(:formatted_address, :latitude, :longitude)
  end
end
