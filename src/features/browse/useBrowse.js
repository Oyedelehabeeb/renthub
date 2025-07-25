import { useQuery } from "@tanstack/react-query";
import { getServices } from "../../services/apiBrowse";

export function useBrowse() {
  const { data, isLoading } = useQuery({
    queryKey: ["browse"],
    queryFn: getServices,
  });
    return { data, isLoading };
}
