import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../services/apiBrowse";

export function useBrowse() {
  const { data, isLoading } = useQuery({
    queryKey: ["browse"],
    queryFn: getItems,
  });
    return { data, isLoading };
}
