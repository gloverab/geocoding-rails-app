class AddressesController < ApplicationController

  def index
    @addresses = Address.order(created_at: :desc).page(params[:page])
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

  def destroy
    address = Address.find(params[:id])
    address.destroy
  end

  private

  def address_params
    params.require(:address).permit(:formatted_address, :latitude, :longitude)
  end
end
