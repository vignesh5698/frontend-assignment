import axios from "axios";
import { serializeAmountRecords } from "../serializer/amountSerializer";

export const getAmountData = () => {
  return axios
    .get(
      "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
    )
    .then((response) => {
      return serializeAmountRecords(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
