import { FC } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
type CourierTableProps = {
  rates: Rate[];
};
type Rate = {
  isOnDemand: Boolean;
  courier: String;
  rateMetroManila: Number;
  rateOutside: Number;
};
const CourierTable: FC = ({ rates }: CourierTableProps) => {
  return (
    <Table>
      <TableCaption>Courier Rates</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Courier</TableHead>
          <TableHead className="text-right">Delivery to Metro Manila</TableHead>
          <TableHead className="text-right">
            Delivery outside Metro Manila
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates != null &&
          rates.length > 0 &&
          rates.map(
            ({ courier, rateMetroManila, rateOutside, isOnDemand }, index) => {
              return (
                <TableRow key={courier + index.toString()}>
                  <TableCell className="font-medium">{courier}</TableCell>
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
  );
};
export default CourierTable;
