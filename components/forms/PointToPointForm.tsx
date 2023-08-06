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

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";

const FormSchema = z.object({
  pickupAddress1: z.string().min(2).max(50),
  pickupAddress2: z.string().min(2).max(50),
  pickupZipcode: z.string().min(4).max(4),
  pickupProvince: z.string() || z.undefined(),
  pickupCity: z.string() || z.undefined(),
  pickupCountry: z.string() || z.undefined(),
  deliveryAddress1: z.string().min(2).max(50),
  deliveryAddress2: z.string().max(50),
  deliveryZipcode: z.string().min(4).max(4),
  deliveryProvince: z.string(),
  deliveryCity: z.string(),
  deliveryCountry: z.string(),
});

const PointToPointForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pickupAddress1: "",
      pickupAddress2: "",
      pickupZipcode: "",
      pickupProvince: undefined,
      pickupCity: undefined,
      pickupCountry: undefined,
      deliveryAddress1: "",
      deliveryAddress2: "",
      deliveryZipcode: "",
      deliveryProvince: undefined,
      deliveryCity: undefined,
      deliveryCountry: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("julie submit", data);
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
      const response = await axios.get("https://psgc.gitlab.io/api/provinces/");
      console.log("julie res", response.data);
      const provinceList = response.data;
      setProvinces(provinceList);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode, setter) => {
    try {
      console.log("julie prov", provinceCode);
      const response = await axios.get(
        `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities`
      );
      console.log("julie city", provinceCode, response.data);
      setter(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const onChangeSelect = (e, field, setter) => {
    console.log("julie field", e, field);
    field.onChange(e);
    // field.value = e;
    fetchCities(e, setter);
  };
  const getPickupInputs = () => {
    return (
      <>
        <FormField
          control={form.control}
          name="pickupAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Enter Address 1" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pickupAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
              <FormControl>
                <Input placeholder="Enter Address 2" {...field} />
              </FormControl>
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
                  (e) => {
                    onChangeSelect(e, field, setPickupCities);
                  }
                }
                value={field.value}
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
                    provinces.map(({ code, name }, index) => (
                      <SelectItem key={`${code}-${index}`} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pickupCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    pickupCities.map(({ code, name }) => (
                      <SelectItem key={`${code}-pickup`} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pickupCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      className="w-[180px] text-slate-950"
                      placeholder="Select Country"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"Philippines"}>Philippines</SelectItem>
                </SelectContent>
              </Select>{" "}
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="pickupZipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Zip Code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };
  const getDeliveryInputs = () => {
    return (
      <>
        <FormField
          control={form.control}
          name="deliveryAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Enter Address 1" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deliveryAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
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
          name="deliveryProvince"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <Select
                onValueChange={
                  // field.onChange
                  (e) => {
                    onChangeSelect(e, field, setDeliveryCities);
                  }
                }
                value={field.value}
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
                    provinces.map(({ code, name }, index) => (
                      <SelectItem key={`${code}-${index}`} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deliveryCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      className="w-[180px] text-slate-950"
                      placeholder="Select City"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {deliveryCities &&
                    deliveryCities.length > 0 &&
                    deliveryCities.map(({ code, name }) => (
                      <SelectItem key={`${code}`} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>{" "}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deliveryCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      className="w-[180px] text-slate-950"
                      placeholder="Select Country"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"Philippines"}>Philippines</SelectItem>
                </SelectContent>
              </Select>{" "}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deliveryZipcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Zip Code" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };
  return (
    <main>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          {getPickupInputs()}
          {getDeliveryInputs()}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default PointToPointForm;
