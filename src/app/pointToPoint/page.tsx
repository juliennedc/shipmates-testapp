"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const FormAddress = () => {
  const [pickup, setPickup] = useState({
    province: "",
    city: "",
  });
  const [delivery, setDelivery] = useState({
    province: "",
    city: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [pickupCities, setPickupCities] = useState([]);
  const [deliveryCities, setDeliveryCities] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "https://ph-locations-api.buonzz.com/v1/provinces"
      );
      console.log("julie client", response.data.data);
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode, setAddressCities) => {
    try {
      const response = await axios.get(
        `https://ph-locations-api.buonzz.com/v1/cities?province_code=${provinceCode}`
      );
      setAddressCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleProvinceChange = (e, setAddressCities) => {
    console.log("julie prov", e);
    const selectedProvince = e.target.value;
    setAddressCities([]);
    setPickup((prev) => ({ ...prev, province: selectedProvince, city: "" }));
    setDelivery((prev) => ({ ...prev, province: selectedProvince, city: "" }));
    fetchCities(selectedProvince, setAddressCities);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Rest of the code remains the same
  };

  return (
    <div>
      <h1>Shipmates Shipping Fee Calculator</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Rest of the code remains the same */}
        <label>Pickup Province:</label>
        <br />
        <Select
          value={pickup.province}
          // onChange={(e) => handleProvinceChange(e, setPickupCities)}
          required
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            {provinces &&
              provinces.length > 0 &&
              provinces.map(({ id, name }) => (
                <SelectItem key={`${id}-pickup`} value={name}>
                  {name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <br />
        <label>Pickup City:</label>
        <br />
        <Select
          value={pickup.city}
          onChange={(e) => setPickup({ ...pickup, city: e.target.value })}
          required
        >
          <option value="">Select City</option>
          {pickupCities.length > 0 &&
            pickupCities.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
        </Select>
        <br />
        <label>Delivery Province:</label>
        <br />
        <Select
          value={delivery.province}
          onChange={(e) => handleProvinceChange(e, setDeliveryCities)}
          required
        >
          <option value="">Select Province</option>
          {provinces &&
            provinces.length > 0 &&
            provinces.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </Select>
        <br />
        <label>Delivery City:</label>
        <br />
        <Select
          value={delivery.city}
          onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
          required
        >
          <option value="">Select City</option>
          {deliveryCities.length > 0 &&
            deliveryCities.map(({ name, id }) => (
              <option key={`${id}-d`} value={name}>
                {name}
              </option>
            ))}
        </Select>
        <br />
        {/* Rest of the code remains the same */}
      </form>
      {/* Rest of the code remains the same */}
    </div>
  );
};

export default FormAddress;
