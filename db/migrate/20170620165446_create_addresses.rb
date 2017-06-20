class CreateAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :addresses do |t|
      t.string :street_address
      t.string :locality
      t.string :region
      t.string :country
      t.string :postal_code
      t.string :formatted_address
      t.decimal :latitude
      t.decimal :longitude

      t.timestamps
    end
  end
end
