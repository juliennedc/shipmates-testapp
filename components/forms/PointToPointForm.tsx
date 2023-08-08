"use client";
import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import ratesData from "./rates.json";
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
  const [isClient, setIsClient] = useState(false);
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
  const [rates, setRates] = useState([]);

  useEffect(() => {
    setIsClient(true);
    fetchProvinces();
    fetchRates();
  }, []);
  const fetchRates = () => {
    fetch(
      "https://github.com/juliennedc/shipmates-testapp/blob/main/components/forms/rates.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRates(data);
      });
  };
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
      <Fragment>
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
                <SelectContent className="max-h-96">
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
      </Fragment>
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
    isClient && (
      <main className="flex ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full min-h-screen h-full p-5 flex flex-col justify-between [&>div:not(:first-child)]:border-t-2 border-border  "
          >
            <div>
              <h2 className="text-xl font-bold"> Pickup</h2>
              <h4 className="text-large text-slate-700">
                Please input your pickup details
              </h4>
              <div className="grid grid-cols-2 gap-4 ">{getPickupInputs()}</div>
            </div>
            <div className="mt-5 py-5">
              <h2 className="text-xl font-bold">Delivery</h2>{" "}
              <h4>Please input your Delivery details</h4>
              <div className="grid grid-cols-2 gap-4 ">
                {getDeliveryInputs()}
              </div>
            </div>

            <Button
              className="w-full bg-sky-600 hover:bg-sky-700"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
        <section className="w-full bg-sky-100 h-auto min-h-screen mx-0 flex justify-center items-center">
          <div className="flex flex-col items-center max-w-lg justify-center p-4 bg-white rounded-lg border-border border-2">
            <h2 className="text-xl text-primary font-bold">Courier Rates</h2>

            <Table>
              <TableCaption>Courier Rates</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Courier</TableHead>
                  <TableHead className="text-right">
                    Rates(Within Metro Manila)
                  </TableHead>
                  <TableHead className="text-right">
                    Rates(Outside Metro Manila)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates != null &&
                  rates.length > 0 &&
                  rates.map(
                    ({ courier, rateMetroManila, rateOutside }, index) => {
                      return (
                        <TableRow key={courier + index}>
                          <TableCell className="font-medium">
                            {courier}
                          </TableCell>
                          <TableCell className="text-right">
                            {rateMetroManila}
                          </TableCell>
                          <TableCell className="text-right">
                            {rateOutside}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>

            <table>
              <thead>
                <tr>Courier</tr>
                <tr>Within Metro Manila</tr>
              </thead>
            </table>
          </div>
        </section>
      </main>
    )
  );
};

export default PointToPointForm;
