"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CourierTable from "../tables/CourierTable";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ratesData from "./rates.json";
import Portlet from "../templates/Portlet";

const FormSchema = z.object({
  pickupAddress1: z.string().min(2).max(50),
  pickupAddress2: z.string().max(50).optional(),
  pickupZipcode: z.string().length(4),
  pickupProvince: z.string() || z.undefined(),
  pickupCity: z.string() || z.undefined(),
  pickupCountry: z.string() || z.undefined(),
  deliveryAddress1: z.string().min(2).max(50).optional(),
  deliveryAddress2: z.string().max(50),
  deliveryZipcode: z.string().length(4),
  deliveryProvince: z.string(),
  deliveryCity: z.string(),
  deliveryCountry: z.string(),
});

const PointToPointForm = () => {
  const [isClient, setIsClient] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [pickupCities, setPickupCities] = useState([]);
  const [deliveryCities, setDeliveryCities] = useState([]);
  const [rates, setRates] = useState([]);
  const [caclRates, setCalcRates] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

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
  useEffect(() => {
    setIsClient(true);
    fetchProvinces();
    fetchRates();
  }, []);
  const fetchRates = () => {
    const response = JSON.parse(JSON.stringify(ratesData));
    setRates(response);
  };
  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://psgc.gitlab.io/api/provinces/");
      const provinceList = response.data;
      provinceList.push({ code: "000000000", name: "Metro Manila" });
      setProvinces(provinceList.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceCode, setter) => {
    type City = {
      provinceCode: string;
      code: string;
      name: string;
      districtCode: boolean;
      isCapital: boolean;
      islandGroupCode: string;
      oldName: string;
      psgc10DigitCode: string;
      regionCode: string;
    };
    let citiesList: City[] = [];
    if (provinceCode == "000000000") {
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
        setter(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
  };
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setInitialLoad(false);
    computeRates(data);
  }
  const computeRates = (data) => {
    type Rate = {
      isOnDemand: boolean;
      courier: string;
      rateMetroManila: number;
      rateOutside: number;
    };
    fetchRates();

    const metroManilaCode = "000000000";
    if (
      data.pickupProvince == metroManilaCode &&
      data.deliveryProvince == metroManilaCode
    ) {
      setCalcRates(rates);
    } else if (
      (data.pickupProvince !== metroManilaCode &&
        data.deliveryProvince !== metroManilaCode) ||
      (data.pickupProvince == metroManilaCode &&
        data.deliveryProvince !== metroManilaCode) ||
      (data.pickupProvince !== metroManilaCode &&
        data.deliveryProvince == metroManilaCode)
    ) {
      let filteredRates = rates.filter((rate: Rate) => !rate.isOnDemand);
      setCalcRates(filteredRates);
    }
  };

  const onChangeSelect = (e, field, setter) => {
    field.onChange(e);
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
                <Input
                  required={false}
                  placeholder="Enter Address 2"
                  {...field}
                />
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
              <Select
                required={true}
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
                required={true}
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
                <Input
                  required={false}
                  placeholder="Enter Address 2"
                  {...field}
                />
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
          name="deliveryCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                required={true}
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
  const getCourierRatesTable = () => {
    if (initialLoad) {
      return (
        <p className="text-slate-500 text-center">
          Input your pickup and delivery details to view the couriers available.
        </p>
      );
    }
    return <CourierTable rates={caclRates} />;
  };
  return (
    isClient && (
      <main className="flex ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full min-h-screen h-full p-5 flex flex-col justify-between [&>div:not(:first-child)]:border-t-2 border-border  "
          >
            <Portlet
              header={"Pickup"}
              subHeader={"Please input your Pickup details"}
            >
              {getPickupInputs()}
            </Portlet>
            <Portlet
              className="mt-5 py-5"
              header={"Delivery"}
              subHeader={" Please input your Delivery details"}
            >
              {getDeliveryInputs()}
            </Portlet>

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
            <h2 className="mb-2 text-xl text-primary font-bold">
              Courier Rates
            </h2>
            {getCourierRatesTable()}
          </div>
        </section>
      </main>
    )
  );
};

export default PointToPointForm;
