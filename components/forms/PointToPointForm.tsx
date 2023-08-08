"use client";
import React, { useState, Fragment, useEffect } from "react";
import axios from "axios";
import ratesData from "./rates.json";
import { searchProvince, searchBaranggay } from "ph-geo-admin-divisions";
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
  const computeRates = (data) => {
    const metroManilaCode = "000000000";
    if (
      data.pickupProvince == metroManilaCode &&
      data.deliveryProvince == metroManilaCode
    ) {
      // setRates();
    } else if (
      (data.pickupProvince !== metroManilaCode &&
        data.deliveryProvince !== metroManilaCode) ||
      (data.pickupProvince == metroManilaCode &&
        data.deliveryProvince !== metroManilaCode) ||
      (data.pickupProvince !== metroManilaCode &&
        data.deliveryProvince == metroManilaCode)
    ) {
      let filteredRates = rates.filter((rate) => !rate.isOnDemand);
      setRates(filteredRates);
    }
  };
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("julie submit", data);
    computeRates(data);
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
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
    const response = JSON.parse(JSON.stringify(ratesData));
    setRates(response);
    console.log("julie rates", response);
  };
  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/provinces/");
      console.log("julie res", response.data);
      const provinceList = response.data;
      provinceList.push({ code: "000000000", name: "Metro Manila" });
      setProvinces(provinceList.sort());
      console.log("julie priov", provinceList);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode, setter) => {
    type City = {
      provinceCode: String;
      code: String;
      name: String;
      districtCode: Boolean;
      isCapital: Boolean;
      islandGroupCode: String;
      oldName: String;
      psgc10DigitCode: String;
      regionCode: String;
    };
    let citiesList: City[] = [];
    if (provinceCode == "000000000") {
      console.log("julie metro");
      citiesList.push(
        {
          code: "1",
          name: " Manila",
          provinceCode: "000000000",
          districtCode: false,
          isCapital: false,
          islandGroupCode: "N/A",
          oldName: "",
          psgc10DigitCode: "000000000",
          regionCode: "120000000",
        },
        {
          code: "2",
          name: " Makati",
          provinceCode: "000000000",
          districtCode: false,
          isCapital: false,
          islandGroupCode: "N/A",
          oldName: "",
          psgc10DigitCode: "000000000",
          regionCode: "120000000",
        },
        {
          code: "3",
          name: " Quezon City",
          provinceCode: "000000000",
          districtCode: false,
          isCapital: false,
          islandGroupCode: "N/A",
          oldName: "",
          psgc10DigitCode: "000000000",
          regionCode: "120000000",
        },
        {
          code: "4",
          name: "Pasay",
          provinceCode: "000000000",
          districtCode: false,
          isCapital: false,
          islandGroupCode: "N/A",
          oldName: "",
          psgc10DigitCode: "000000000",
          regionCode: "120000000",
        },
        {
          code: "5",
          name: "Taguig",
          provinceCode: "000000000",
          districtCode: false,
          isCapital: false,
          islandGroupCode: "N/A",
          oldName: "",
          psgc10DigitCode: "000000000",
          regionCode: "120000000",
        }
      );
      setter(citiesList);
    } else {
      try {
        const response = await axios.get(
          `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities`
        );
        console.log("julie city", provinceCode, response.data);

        console.log("julie not metro", response.data);

        setter(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };

  const onChangeSelect = (e, field, setter) => {
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
                    Delivery to Metro Manila
                  </TableHead>
                  <TableHead className="text-right">
                    Delivery outside Metro Manila
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates != null &&
                  rates.length > 0 &&
                  rates.map(
                    (
                      { courier, rateMetroManila, rateOutside, isOnDemand },
                      index
                    ) => {
                      return (
                        <TableRow key={courier + index}>
                          <TableCell className="font-medium">
                            {courier}
                          </TableCell>
                          <TableCell className="text-right">
                            {rateMetroManila}
                          </TableCell>
                          <TableCell className="text-right">
                            {/* if on demand, no delivery outside metro manila */}
                            {!isOnDemand ? rateOutside : "N/A"}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    )
  );
};

export default PointToPointForm;
