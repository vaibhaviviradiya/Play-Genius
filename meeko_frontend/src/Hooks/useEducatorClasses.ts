// hooks/useEducatorClasses.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEducatorClasses = async () => {
  const token = localStorage.getItem("token"); // or wherever you store JWT
  const { data } = await axios.get("http://localhost:3000/educator/getallclasssesofeducator", {
    headers: {
      Authorization: ` ${token}`,
    },
  });
  return data.data;
};

export const useEducatorClasses = () => {
  return useQuery({
    queryKey: ["educatorClasses"],
    queryFn: fetchEducatorClasses,
      staleTime : 1000 * 60 * 5
  });
};
