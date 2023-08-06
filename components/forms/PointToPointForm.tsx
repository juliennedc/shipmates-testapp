"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";

const FormSchema = z.object({
  pickupAddress1: z.string().min(2).max(50),
  pickupAddress2: z.string().min(2).max(50),
  pickupZipcode: z.string().min(5).max(5),
  pickupProvince: z.string(),
  pickupCity: z.string(),
  pickupCountry: z.string(),
  // pickupProvince: z.object({ id: z.string(), name: z.string() }),
  // pickupCity: z.object({ id: z.string(), name: z.string() }),
  // pickupCountry: z.object({ id: z.string(), name: z.string() }),
});

const PointToPointForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pickupAddress1: "",
      pickupAddress2: "",
      pickupZipcode: "",
      pickupProvince: "",
      pickupCity: "",
      pickupCountry: "",
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
      const provinceList = response.data.data.filter(
        (item) => item.name != "CITY OF MANILA"
      );
      setProvinces(provinceList);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode, setter) => {
    try {
      const response = await axios.get(
        `https://ph-locations-api.buonzz.com/v1/cities?province_code=${provinceCode}`
      );
      setter(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const onChangeSelect = (e, field, setter) => {
    console.log("julie field", e, field);
    field.onChange();
    fetchCities(e, setter);
  };
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="pickupAddress1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address 1" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupAddress2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address 1</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address 2" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select
                  onValueChange={
                    // field.onChange
                    (e) => onChangeSelect(e, field, setPickupCities)
                  }
                  // value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="w-[180px] text-slate-950"
                        placeholder="Select Province"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces &&
                      provinces.length > 0 &&
                      provinces.map(({ id, name }, index) => (
                        <SelectItem key={`${id}-${index}`} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="w-[180px] text-slate-950"
                        placeholder="Select City"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pickupCities &&
                      pickupCities.length > 0 &&
                      pickupCities.map(({ id, name }) => (
                        <SelectItem key={`${id}-pickup`} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
  // return (
  // <div>
  //   <h1>Shipmates Shipping Fee Calculator</h1>
  //   <Form onSubmit={handleFormSubmit}>
  //     {/* Rest of the code remains the same */}
  //     <label>Pickup Province:</label>
  //     <br />
  //     <Select
  //       value={pickupProvince}
  //       onValueChange={(e) =>
  //         handleProvinceChange(e, setPickupCities, pickupProvince)
  //       }
  //       required
  //     >
  //       <SelectTrigger className="w-[180px]">
  //         <SelectValue placeholder="Select Province" />
  //       </SelectTrigger>
  //       <SelectContent>
  //         {provinces &&
  //           provinces.length > 0 &&
  //           provinces.map(({ id, name }) => (
  //             <SelectItem key={`${id}-pickup`} value={id}>
  //               {name}
  //             </SelectItem>
  //           ))}
  //       </SelectContent>
  //     </Select>
  //     <br />
  //     <label>Pickup City:</label>
  //     <br />
  //     <Select
  //       value={pickupCity}
  //       onValueChange={(e) => setPickupCity(e)}
  //       required
  //     >
  //       <SelectTrigger className="w-[180px]">
  //         <SelectValue placeholder="Select City" />
  //       </SelectTrigger>
  //       <SelectContent>
  //         {pickupCities.length > 0 &&
  //           pickupCities.map(({ id, name }) => (
  //             <SelectItem key={id} value={name}>
  //               {name}
  //             </SelectItem>
  //           ))}
  //       </SelectContent>
  //     </Select>
  //     <br />
  //     <label>Delivery Province:</label>
  //     <br />
  //     <Select
  //       value={deliveryProvince}
  //       onValueChange={(e) => handleProvinceChange(e, setDeliveryCities)}
  //       required
  //     >
  //       <SelectTrigger className="w-[180px]">
  //         <SelectValue placeholder="Select Province" />
  //       </SelectTrigger>
  //       <SelectContent>
  //         {provinces &&
  //           provinces.length > 0 &&
  //           provinces.map(({ id, name }) => (
  //             <SelectItem key={id} value={id}>
  //               {name}
  //             </SelectItem>
  //           ))}
  //       </SelectContent>
  //     </Select>
  //     <br />
  //     <label>Delivery City:</label>
  //     <br />
  //     <Select
  //       value={deliveryCity}
  //       onValueChange={(e) => setDeliveryCity(e)}
  //       required
  //     >
  //       <SelectTrigger className="w-[180px]">
  //         <SelectValue placeholder="Select City" />
  //       </SelectTrigger>
  //       <SelectContent>
  //         {" "}
  //         {deliveryCities.length > 0 &&
  //           deliveryCities.map(({ name, id }) => (
  //             <SelectItem key={`${id}-d`} value={name}>
  //               {name}
  //             </SelectItem>
  //           ))}
  //       </SelectContent>
  //     </Select>
  //     <br />
  //   </Form>
  // </div>
  // );
};

export default PointToPointForm;
